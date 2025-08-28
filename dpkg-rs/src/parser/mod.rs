mod analytics;
mod callback;
mod channels;
mod servers;
mod user;
mod utils;

use anyhow::Result;
use std::collections::HashMap;
use std::io::Read;
use zip::ZipArchive;

use crate::models::UserData;
pub use crate::parser::callback::*;

pub struct Parser {
    pub(crate) file_index: HashMap<String, usize>,
}

impl Parser {
    pub fn new() -> Self {
        Self {
            file_index: HashMap::new(),
        }
    }

    pub async fn extract_data<R: Read + std::io::Seek + std::marker::Send>(
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
}
