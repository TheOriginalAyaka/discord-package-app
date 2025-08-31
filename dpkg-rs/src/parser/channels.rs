use anyhow::Result;
use chrono::Timelike;
use regex::Regex;
use std::collections::HashMap;
use std::io::{Read, Seek};
use zip::ZipArchive;

use crate::models::{DChannel, DMessage, Message, TopChannel, TopDM, UserData, WordCount};
use crate::parser::{Callback, Parser};

impl<'a> Parser<'a> {
    pub(super) fn load_channels<R: Read + Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        messages_root: &str,
        extracted_data: &mut UserData,
        callback: &Callback,
    ) -> Result<()> {
        // let messages_index = self.load_messages_index(archive, messages_root)?;
        let channel_ids = self.scan_channel_ids(archive, messages_root)?;

        callback.progress(
            crate::parser::Step::Messages,
            format!("Found {} channels to process", channel_ids.len()),
        );

        let (is_old_package, is_old_package_v2) =
            self.detect_package_format(messages_root, &channel_ids);

        let mut word_counts: HashMap<String, u32> = HashMap::new();
        let mut channel_message_counts: Vec<TopChannel> = Vec::new();
        let mut dm_message_counts: Vec<TopDM> = Vec::new();

        for (index, channel_id) in channel_ids.iter().enumerate() {
            self.check_cancellation_token()?;
            if channel_ids.is_empty() {
                break;
            }

            if index % 20 == 0 {
                callback.progress(
                    crate::parser::Step::Messages,
                    format!(
                        "Processing channel {} of {} (ID: {})",
                        index + 1,
                        channel_ids.len(),
                        channel_id
                    ),
                );
            }

            let prefix = if is_old_package { "" } else { "c" };
            let extension = if is_old_package_v2 { "csv" } else { "json" };

            let channel_data_path =
                format!("{}/{}{}/channel.json", messages_root, prefix, channel_id);
            let channel_messages_path = format!(
                "{}/{}{}/messages.{}",
                messages_root, prefix, channel_id, extension
            );

            let channel_data = self.read_file(archive, &channel_data_path)?;
            let channel_messages_content = self.read_file(archive, &channel_messages_path)?;

            if let (Some(data_content), Some(messages_content)) =
                (channel_data, channel_messages_content)
            {
                let channel: DChannel = match self.parse_json(&data_content) {
                    Ok(ch) => ch,
                    Err(e) => {
                        println!(
                            "[debug] Failed to parse channel data for {}: {}",
                            channel_id, e
                        );
                        continue;
                    }
                };

                let messages: Vec<Message> = if extension == "csv" {
                    self.parse_csv(&messages_content)?
                } else {
                    match self.parse_json_messages(&messages_content) {
                        Ok(m) => m,
                        Err(e) => {
                            println!("[debug] Failed to parse messages for {}: {}", channel_id, e);
                            Vec::new()
                        }
                    }
                };

                // let name: &str = messages_index
                //     .get(&channel.id)
                //     .map(|s| s.as_str())
                //     .unwrap_or(&channel.id);

                let is_dm = channel.recipients.as_ref().is_some_and(|r| r.len() == 2);
                let dm_user_id = if is_dm {
                    channel.recipients.as_ref().and_then(|recipients| {
                        extracted_data
                            .user
                            .as_ref()
                            .and_then(|user| recipients.iter().find(|&id| id != &user.id))
                    })
                } else {
                    None
                };

                let mut message_count = 0;
                for message in &messages {
                    self.check_cancellation_token()?;
                    message_count += 1;
                    extracted_data.character_count += message.length;
                    if let Ok(dt) = chrono::NaiveDateTime::parse_from_str(
                        &message.timestamp,
                        "%Y-%m-%d %H:%M:%S",
                    ) {
                        extracted_data.hours_values[dt.hour() as usize] += 1;
                    }

                    if !&message.words.is_empty() {
                        for word in message.words.iter().filter(|w| w.len() > 5) {
                            *word_counts.entry(word.clone()).or_insert(0) += 1;
                        }
                    }
                }

                if is_dm {
                    if let Some(dm_id) = dm_user_id {
                        dm_message_counts.push(TopDM {
                            id: channel.id.clone(),
                            dm_user_id: dm_id.clone(),
                            message_count,
                        });
                    }
                } else {
                    let (guild_name, guild_id) = if let Some(guild) = &channel.guild {
                        (Some(guild.name.clone()), Some(guild.id.clone()))
                    } else {
                        (None, None)
                    };
                    channel_message_counts.push(TopChannel {
                        id: channel.id.clone(),
                        name: channel.name.clone(),
                        r#type: channel.r#type.clone(),
                        guild_name,
                        guild_id,
                        message_count,
                    });
                }
            }
        }

        self.finalize_channel_stats(
            extracted_data,
            word_counts,
            channel_message_counts,
            dm_message_counts,
        );

        Ok(())
    }

    // Local helpers (private)
    fn parse_csv(&self, content: &str) -> Result<Vec<Message>> {
        let mut reader = csv::Reader::from_reader(content.as_bytes());
        let mut messages = Vec::new();
        for result in reader.deserialize() {
            self.check_cancellation_token()?;
            let record: DMessage = result?;

            let words = Parser::process_words(&record.contents);
            messages.push(Message {
                id: record.id,
                timestamp: record.timestamp,
                content: record.contents.clone(),
                attachments: record
                    .attachments
                    .split(' ')
                    .map(|s| s.to_string())
                    .collect(),
                length: record.contents.len() as u32,
                words,
            });
        }
        Ok(messages)
    }

    fn parse_json_messages(&self, content: &str) -> Result<Vec<Message>> {
        let messages: Vec<DMessage> = match self.parse_json(content) {
            Ok(m) => m,
            Err(_) => match self.parse_json::<DMessage>(content) {
                Ok(msg) => vec![msg],
                Err(e) => return Err(e),
            },
        };
        Ok(messages
            .into_iter()
            .map(|m| {
                let words = Parser::process_words(&m.contents);
                Message {
                    id: m.id,
                    content: m.contents.clone(),
                    attachments: m.attachments.split(' ').map(|s| s.to_string()).collect(),
                    timestamp: m.timestamp,
                    length: m.contents.len() as u32,
                    words,
                }
            })
            .collect())
    }

    // fn load_messages_index<R: Read + Seek>(
    //     &self,
    //     archive: &mut ZipArchive<R>,
    //     messages_root: &str,
    // ) -> Result<HashMap<String, String>> {
    //     let path = format!("{}/index.json", messages_root);
    //     let content = self.read_file(archive, &path)?;
    //     Ok(content
    //         .map(|c| {
    //             self.parse_json(&c).unwrap_or_else(|e| {
    //                 println!("[debug] Failed to parse messages index: {}", e);
    //                 HashMap::new()
    //             })
    //         })
    //         .unwrap_or_default())
    // }

    fn scan_channel_ids<R: Read + Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        messages_root: &str,
    ) -> Result<Vec<String>> {
        let channel_regex = Regex::new(r"c?([0-9]{16,32})/$")?;
        let mut channel_ids = Vec::new();
        for i in 0..archive.len() {
            self.check_cancellation_token()?;
            let file = archive.by_index(i)?;
            let name = file.name();
            if name.starts_with(messages_root)
                && let Some(captures) = channel_regex.captures(name)
            {
                channel_ids.push(captures[1].to_string());
            }
        }
        Ok(channel_ids)
    }

    fn detect_package_format(&self, messages_root: &str, channel_ids: &[String]) -> (bool, bool) {
        let is_old_package = channel_ids
            .iter()
            .any(|id| self.file_exists(&format!("{}/{}/channel.json", messages_root, id)));
        let is_old_package_v2 = !channel_ids
            .iter()
            .any(|id| self.file_exists(&format!("{}/c{}/messages.json", messages_root, id)));
        println!("[debug] Old package (2021): {}", is_old_package);
        println!("[debug] Old package (2024): {}", is_old_package_v2);
        (is_old_package, is_old_package_v2)
    }

    fn finalize_channel_stats(
        &self,
        extracted_data: &mut UserData,
        word_counts: HashMap<String, u32>,
        mut channel_message_counts: Vec<TopChannel>,
        mut dm_message_counts: Vec<TopDM>,
    ) {
        extracted_data.channel_count = channel_message_counts.len() as u32;
        extracted_data.dm_channel_count = dm_message_counts.len() as u32;
        extracted_data.message_count = channel_message_counts
            .iter()
            .map(|c| c.message_count)
            .sum::<u32>()
            + dm_message_counts
                .iter()
                .map(|c| c.message_count)
                .sum::<u32>();

        channel_message_counts.sort_by(|a, b| b.message_count.cmp(&a.message_count));
        extracted_data.top_channels = channel_message_counts.into_iter().take(10).collect();

        dm_message_counts.sort_by(|a, b| b.message_count.cmp(&a.message_count));
        extracted_data.top_dms = dm_message_counts.into_iter().take(10).collect();

        let emote_regex = Regex::new(r"<(a?):([^:]+):(\d+)>");
        let mut word_vec: Vec<_> = word_counts.into_iter().collect();
        word_vec.sort_by(|a, b| b.1.cmp(&a.1));

        match emote_regex {
            Ok(ref regex) => {
                extracted_data.favorite_emotes = word_vec
                    .iter()
                    .filter(|word| regex.is_match(&word.0))
                    .take(10)
                    .map(|(word, count)| WordCount {
                        word: word.clone(),
                        count: *count,
                    })
                    .collect();

                extracted_data.favorite_words = word_vec
                    .into_iter()
                    .filter(|word| !regex.is_match(&word.0))
                    .take(10)
                    .map(|(word, count)| WordCount { word, count })
                    .collect();
            }
            Err(e) => {
                println!("[debug] Failed to compile emote regex: {}", e);
                extracted_data.favorite_emotes = Vec::new();
                extracted_data.favorite_words = word_vec
                    .into_iter()
                    .take(10)
                    .map(|(word, count)| WordCount { word, count })
                    .collect();
            }
        }
    }
}
