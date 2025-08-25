mod models;
mod parser;

uniffi::setup_scaffolding!();
use std::fs::File;
use std::sync::Arc;
use std::thread;
use zip::ZipArchive;

use crate::models::extracted_data::ExtractedData;
use crate::parser::Parser;

#[uniffi::export(with_foreign)]
pub trait ExtractObserver: Send + Sync {
    fn on_progress(&self, step: String);
    fn on_error(&self, message: String);
    fn on_complete(&self, result: ExtractedData);
}

#[uniffi::export]
pub fn start_extraction(path: String, observer: Arc<dyn ExtractObserver>) {
    thread::spawn(move || {
        let rt = match tokio::runtime::Runtime::new() {
            Ok(rt) => rt,
            Err(err) => {
                observer.on_error(format!("Failed to create async runtime: {}", err));
                return;
            }
        };

        match File::open(&path) {
            Ok(file) => {
                observer.on_progress("Opened file".into());

                match ZipArchive::new(file) {
                    Ok(archive) => {
                        let mut parser = Parser::new();

                        let progress_callback = |msg: String| {
                            observer.on_progress(msg);
                        };

                        match rt.block_on(parser.extract_data(archive, progress_callback)) {
                            Ok(data) => {
                                observer.on_complete(data);
                            }
                            Err(err) => {
                                observer.on_error(format!("Extraction error: {}", err));
                            }
                        }
                    }
                    Err(err) => observer.on_error(format!("Failed to open ZIP archive: {}", err)),
                }
            }
            Err(err) => {
                observer.on_error(format!("Failed to open file: {}", err));
            }
        }
    });
}

#[cfg(test)]
mod tests {
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
        fn on_progress(&self, step: String) {
            println!("[{}] Progress: {}", self.name, step);
        }

        fn on_error(&self, message: String) {
            println!("[{}] Error: {}", self.name, message);
        }

        fn on_complete(&self, result: ExtractedData) {
            println!("[{}] Complete! result: {:?}", self.name, result);
            let _ = self.sender.send(());
        }
    }
    #[test]
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

        match receiver.recv_timeout(std::time::Duration::from_secs(30)) {
            Ok(_) => println!("Test completed successfully"),
            Err(_) => panic!("Test timed out after 30 seconds"),
        }
    }
}
