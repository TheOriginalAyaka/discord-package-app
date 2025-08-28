use anyhow::Result;
use std::collections::HashMap;
use std::io::Read;
use zip::ZipArchive;

use crate::models::UserData;
use crate::parser::{Callback, Parser};

impl Parser {
    pub(super) fn load_servers<R: Read + std::io::Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        servers_root: &str,
        extracted_data: &mut UserData,
        callback: &Callback,
    ) -> Result<()> {
        callback.progress(
            crate::parser::Step::Messages,
            "Loading guild information...".to_string(),
        );

        let guild_index_path = format!("{}/index.json", servers_root);

        if let Some(content) = self.read_file(archive, &guild_index_path)? {
            println!("[debug] Loading guild index from: {}", guild_index_path);

            match self.parse_json::<HashMap<String, String>>(&content) {
                Ok(guild_index) => {
                    extracted_data.guild_count = guild_index.len() as u32;
                }
                Err(e) => println!("[debug] Failed to parse guild index: {}", e),
            }
        }

        Ok(())
    }
}
