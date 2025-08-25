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
                        observer.on_progress("Analyzing package structure...".into());

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
