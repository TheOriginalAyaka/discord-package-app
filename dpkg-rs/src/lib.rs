mod models;
mod parser;

uniffi::setup_scaffolding!();
use std::fs::File;
use std::sync::Arc;
use std::thread;
use zip::ZipArchive;

use crate::models::ExtractObserver;
use crate::parser::{Callback, Parser, Step};

#[uniffi::export]
pub fn start_extraction(path: String, observer: Arc<dyn ExtractObserver>) {
    let callback = Callback::new(observer);
    thread::spawn(move || {
        let rt = match tokio::runtime::Runtime::new() {
            Ok(rt) => rt,
            Err(err) => {
                callback.error(
                    Step::Scaffolding,
                    format!("Failed to create async runtime: {}", err),
                    "Runtime error".into(),
                );
                return;
            }
        };

        match File::open(&path) {
            Ok(file) => {
                callback.progress(Step::Scaffolding, "Opened Archive".into());

                match ZipArchive::new(file) {
                    Ok(mut archive) => {
                        let mut parser = Parser::new();

                        match rt.block_on(parser.extract_data(&mut archive, &callback)) {
                            Ok(data) => {
                                callback.data_complete(data);
                            }
                            Err(err) => {
                                callback.error(
                                    Step::Messages,
                                    format!("{}", err),
                                    "Parsing error".into(),
                                );
                            }
                        }
                        // TODO: implement a way to cancel processing analytics
                        match rt.block_on(parser.load_analytics(&mut archive, &callback)) {
                            Ok(data) => {
                                callback.analytics_complete(data);
                            }
                            Err(err) => {
                                callback.error(
                                    Step::Analytics,
                                    format!("{}", err),
                                    "Parsing error".into(),
                                );
                            }
                        }
                    }
                    Err(err) => {
                        callback.error(
                            Step::Scaffolding,
                            format!("{}", err),
                            "Archive error".into(),
                        );
                    }
                }
            }
            Err(err) => {
                callback.error(
                    Step::Scaffolding,
                    format!("{}", err),
                    "Extraction error".into(),
                );
            }
        }
    });
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
            println!("[{}] Error: {}", self.name, error.message);
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
        start_extraction(file_path.clone(), observer);

        match receiver.recv_timeout(std::time::Duration::from_secs(300)) {
            Ok(_) => println!("Test completed successfully"),
            Err(_) => panic!("Test timed out after 30 seconds"),
        }
    }
}
