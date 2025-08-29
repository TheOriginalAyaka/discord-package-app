mod analytics;
mod callback;
mod channels;
mod servers;
mod user;
mod utils;

use anyhow::{Result, anyhow};
use std::collections::HashMap;
use std::io::Read;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use zip::ZipArchive;

use crate::models::UserData;
pub use crate::parser::callback::*;

pub struct Parser<'a> {
    pub(crate) file_index: HashMap<String, usize>,
    pub(crate) cancellation_token: &'a Arc<AtomicBool>,
}

impl<'a> Parser<'a> {
    pub fn new(cancellation_token: &'a Arc<AtomicBool>) -> Self {
        Self {
            file_index: HashMap::new(),
            cancellation_token,
        }
    }

    pub fn process_data<R: Read + std::io::Seek + std::marker::Send>(
        &mut self,
        archive: &mut ZipArchive<R>,
        callback: &Callback,
    ) -> Result<UserData> {
        let mut extracted_data = UserData::default();

        callback.progress(Step::Messages, "Analyzing package structure...".into());

        self.file_index = (0..archive.len())
            .map(|i| (archive.by_index(i).unwrap().name().to_string(), i))
            .collect();

        let file_names: Vec<&String> = self.file_index.keys().collect();

        let messages_root = Parser::get_messages_root(&file_names)?;
        let servers_root = Parser::get_servers_root(&file_names)?;
        let user_root = Parser::get_user_root(&file_names)?;

        println!("[debug] Found messages root: {}", messages_root);
        println!("[debug] Found servers root: {}", servers_root);
        println!("[debug] Found user root: {}", user_root);

        self.load_user(archive, &user_root, &mut extracted_data, callback)?;
        self.load_channels(archive, &messages_root, &mut extracted_data, callback)?;
        self.load_servers(archive, &servers_root, &mut extracted_data, callback)?;

        callback.progress(Step::Messages, "Finalizing extraction...".to_string());
        println!("[debug] Extraction complete");
        Ok(extracted_data)
    }

    pub(super) fn check_cancellation_token(&self) -> Result<()> {
        if self.cancellation_token.load(Ordering::Relaxed) {
            Err(anyhow!("Processing cancelled"))
        } else {
            Ok(())
        }
    }
}
