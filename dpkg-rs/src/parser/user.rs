use anyhow::Result;
use std::io::Read;
use zip::ZipArchive;

use crate::models::{User, UserData};
use crate::parser::{Callback, Parser};

impl Parser {
    pub(super) fn load_user<R: Read + std::io::Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        user_root: &str,
        extracted_data: &mut UserData,
        callback: &Callback,
    ) -> Result<()> {
        callback.progress(
            crate::parser::Step::Messages,
            "Loading user information...".to_string(),
        );

        let user_path = format!("{}/user.json", user_root);

        if let Some(content) = self.read_file(archive, &user_path)? {
            println!("[debug] Loading user info from: {}", user_path);

            if let Ok(user) = self.parse_json::<User>(&content) {
                extracted_data.user = Some(user);
            } else {
                println!("[debug] Failed to parse user.json");
            }
        }

        Ok(())
    }
}
