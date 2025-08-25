use anyhow::Result;
use std::io::Read;
use zip::ZipArchive;

use crate::models::ExtractedData;
use crate::parser::Parser;

impl Parser {
    pub(super) fn load_analytics<R: Read + std::io::Seek, F>(
        &self,
        _archive: &mut ZipArchive<R>,
        file_names: &[&String],
        extracted_data: &mut ExtractedData,
        progress_callback: &F,
    ) -> Result<()>
    where
        F: Fn(String) + Send + Sync,
    {
        progress_callback("Processing analytics...".to_string());

        let analytics_regex =
            regex::Regex::new(r"analytics/events-[0-9]{4}-[0-9]{5}-of-[0-9]{5}\.json$")?;

        let analytics_file = file_names
            .iter()
            .find(|f| analytics_regex.is_match(f.as_str()));

        if analytics_file.is_some() {
            // TODO: parse analytics file
            extracted_data.open_count = Some(0);
            extracted_data.notification_count = Some(0);
            extracted_data.join_voice_channel_count = Some(0);
            extracted_data.join_call_count = Some(0);
            extracted_data.add_reaction_count = Some(0);
            extracted_data.message_edited_count = Some(0);
            extracted_data.sent_message_count = Some(0);
            extracted_data.slash_command_used_count = Some(0);
        }

        Ok(())
    }
}
