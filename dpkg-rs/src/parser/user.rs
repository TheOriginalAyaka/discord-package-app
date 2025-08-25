use anyhow::Result;
use std::io::Read;
use zip::ZipArchive;

use crate::models::{ExtractedData, Payment, User};
use crate::parser::Parser;

impl Parser {
    pub(super) async fn load_user<R: Read + std::io::Seek, F>(
        &self,
        archive: &mut ZipArchive<R>,
        user_root: &str,
        extracted_data: &mut ExtractedData,
        progress_callback: &F,
    ) -> Result<()>
    where
        F: Fn(String) + Send + Sync,
    {
        progress_callback("Loading user information...".to_string());

        let user_path = format!("{}/user.json", user_root);

        if let Some(content) = self.read_file(archive, &user_path)? {
            println!("[debug] Loading user info from: {}", user_path);

            if let Ok(user) = self.parse_json::<User>(&content) {
                self.process_payments(extracted_data, &user);
                extracted_data.user = Some(user);
            } else {
                println!("[debug] Failed to parse user.json");
            }
        }

        Ok(())
    }

    // async fn fetch_user(&self, _user_id: &str) -> Result<UserData> {
    //     // TODO: Implement actual user fetching logic
    //     Ok(UserData {
    //         username: "Unknown".to_string(),
    //         discriminator: 0,
    //         avatar: None,
    //     })
    // }

    fn process_payments(&self, extracted_data: &mut ExtractedData, user: &User) {
        let confirmed: Vec<&Payment> = user.payments.iter().filter(|p| p.status == 1).collect();
        if confirmed.is_empty() {
            return;
        }
        for payment in &confirmed {
            *extracted_data
                .payments
                .total
                .entry(payment.currency.clone())
                .or_insert(0.0) += payment.amount as f64 / 100.0;
        }
        let mut sorted = confirmed;
        sorted.sort_by(|a, b| a.created_at.cmp(&b.created_at));
        extracted_data.payments.list = sorted
            .iter()
            .map(|p| {
                format!(
                    "{} ({} {:.2})",
                    p.description,
                    p.currency.to_uppercase(),
                    p.amount as f64 / 100.0
                )
            })
            .collect::<Vec<_>>()
            .join("<br>");
    }
}
