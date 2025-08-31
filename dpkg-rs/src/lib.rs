mod models;
mod parser;

uniffi::setup_scaffolding!();
use lazy_static::lazy_static;
use std::collections::HashMap;
use std::fs::{self, File};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread;
use uuid::Uuid;
use zip::ZipArchive;

use crate::models::ExtractObserver;
use crate::parser::{Callback, Parser, Step};

lazy_static! {
    static ref EXTRACTIONS: Mutex<HashMap<String, Arc<AtomicBool>>> = Mutex::new(HashMap::new());
}

fn cleanup_extraction(extraction_id: &str) {
    let mut extractions = EXTRACTIONS.lock().unwrap();
    extractions.remove(extraction_id);
}

#[uniffi::export]
fn start_extraction(path: String, observer: Arc<dyn ExtractObserver>) -> Option<String> {
    let callback = Callback::new(observer);
    let extraction_id = Uuid::new_v4().to_string();
    let cancellation_token = Arc::new(AtomicBool::new(false));

    {
        let mut extractions = match EXTRACTIONS.lock() {
            Ok(e) => e,
            Err(err) => {
                callback.error(
                    Step::Scaffolding,
                    format!("Error getting extractions lock: {}", err),
                    "Runtime error".into(),
                );
                return None;
            }
        };
        extractions.insert(extraction_id.clone(), cancellation_token.clone());
    }

    let return_id = extraction_id.clone();

    thread::spawn(move || {
        let file = match File::open(&path) {
            Ok(f) => f,
            Err(err) => {
                callback.error(
                    Step::Scaffolding,
                    format!("Failed to open file: {}", err),
                    "File access error".into(),
                );
                cleanup_extraction(&extraction_id);
                return;
            }
        };

        callback.progress(Step::Scaffolding, "Opened Archive".into());

        let mut archive = match ZipArchive::new(file) {
            Ok(archive) => archive,
            Err(err) => {
                callback.error(
                    Step::Scaffolding,
                    format!("Failed to read archive: {}", err),
                    "Archive error".into(),
                );
                cleanup_extraction(&extraction_id);
                return;
            }
        };

        let mut parser = Parser::new(&cancellation_token);

        match parser.process_data(&mut archive, &callback) {
            Ok(data) => {
                callback.data_complete(data);
            }
            Err(err) => {
                callback.error(
                    Step::Messages,
                    format!("{}", err),
                    "Data extraction error".into(),
                );
                cleanup_extraction(&extraction_id);
                return;
            }
        }

        match parser.process_analytics(&mut archive, &callback) {
            Ok(data) => {
                callback.analytics_complete(data);
            }
            Err(err) => {
                callback.error(
                    Step::Analytics,
                    format!("{}", err),
                    "Analytics processing error".into(),
                );
                cleanup_extraction(&extraction_id);
                return;
            }
        }

        cleanup_extraction(&extraction_id);
        let _ = fs::remove_file(&path);
    });

    Some(return_id)
}

#[uniffi::export]
fn cancel_extraction(extraction_id: String) -> bool {
    let extractions = EXTRACTIONS.lock().unwrap();
    if let Some(token) = extractions.get(&extraction_id) {
        token.store(true, Ordering::Relaxed);
        true
    } else {
        false
    }
}

#[cfg(test)]
mod tests {
    use crate::models::{EventCount, OnError, OnProgress, UserData};

    use super::*;
    use std::sync::mpsc;

    struct TestObserver {
        name: String,
        sender: mpsc::Sender<()>,
    }

    impl TestObserver {
        fn new(name: &str, sender: mpsc::Sender<()>) -> Self {
            Self {
                name: name.to_string(),
                sender,
            }
        }
    }

    impl ExtractObserver for TestObserver {
        fn on_progress(&self, progress: OnProgress) {
            println!("[{}] Progress: {}", self.name, progress.message);
        }

        fn on_error(&self, error: OnError) {
            println!("[{}] Error({}): {}", self.name, error.title, error.message);
        }

        fn on_complete(&self, result: UserData) {
            println!("[{}] Complete! result: {:?}", self.name, result);
        }

        fn on_analytics_complete(&self, result: EventCount) {
            println!("[{}] Analytics complete! result: {:?}", self.name, result);
            let _ = self.sender.send(());
        }
    }
    #[test]
    #[ignore = "Just local testing"]
    fn extraction_test() {
        let args: Vec<String> = std::env::args().collect();
        if args.len() < 3 {
            panic!(
                "Please provide a file path as argument: cargo test extraction_test -- /path/to/file.zip --nocapture"
            );
        }
        let file_path = &args[2];

        let (sender, receiver) = mpsc::channel();
        let observer = Arc::new(TestObserver::new("TestRun", sender));
        println!("Starting extraction");
        let _ = start_extraction(file_path.clone(), observer);

        match receiver.recv_timeout(std::time::Duration::from_secs(300)) {
            Ok(_) => println!("Test completed successfully"),
            Err(_) => panic!("Test timed out after 300 seconds"),
        }
    }
}
