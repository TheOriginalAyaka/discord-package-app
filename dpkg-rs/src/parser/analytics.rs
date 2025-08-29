use anyhow::Result;
use rayon::prelude::*;
use std::io::{BufRead, BufReader, Read};
use std::sync::Mutex;
use std::time::Instant;
use sysinfo::System;
use zip::ZipArchive;

use crate::models::{ApplicationCommandUsed, Event, EventCount, MostUsedCommand};
use crate::parser::{Callback, Parser};

impl<'a> Parser<'a> {
    pub fn process_analytics<R: Read + std::io::Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        callback: &Callback,
    ) -> Result<EventCount> {
        callback.progress(
            crate::parser::Step::Analytics,
            "Processing analytics...".to_string(),
        );
        let time = Instant::now();

        let file_names: Vec<&String> = self.file_index.keys().collect();
        let analytics_file_name = Parser::get_analytics_root(&file_names)?;

        let file = archive.by_name(&analytics_file_name)?;

        let (buffer_capacity, batch_size) = self.determine_resources();

        let reader = BufReader::with_capacity(buffer_capacity, file);

        let result = self.analytics_handler(reader, callback, batch_size)?;

        let finished = time.elapsed();
        println!("Process analytics took: {:?}", finished);

        Ok(result)
    }

    fn analytics_handler<R: Read>(
        &self,
        reader: R,
        callback: &Callback,
        batch_size: usize,
    ) -> Result<EventCount> {
        let mut processed_lines = 0;

        let counts = Mutex::new(EventCount::default());

        callback.progress(
            crate::parser::Step::Analytics,
            "Processing analytics in batches...".to_string(),
        );

        let mut line_iter = BufReader::new(reader).lines();
        let mut batch_number = 0;

        loop {
            self.check_cancellation_token()?;

            let mut batch = Vec::with_capacity(batch_size);
            for line in line_iter.by_ref().take(batch_size).flatten() {
                batch.push(line.into_bytes());
            }

            if batch.is_empty() {
                break;
            }

            batch_number += 1;
            let lines_in_batch = batch.len();
            processed_lines += lines_in_batch;

            if batch_number % 10 == 0 {
                callback.progress(
                    crate::parser::Step::Analytics,
                    format!(
                        "Processing batch {} ({} lines processed so far)",
                        batch_number, processed_lines
                    ),
                );
            }

            batch.into_par_iter().for_each(|mut line| {
                if let Ok(event) = simd_json::from_slice::<Event>(&mut line.clone()) {
                    let mut counts = counts.lock().unwrap();
                    counts.all_events += 1;
                    match event.event_type.as_str() {
                        "application_created" => counts.application_created += 1,
                        "bot_token_compromised" => counts.bot_token_compromised += 1,
                        "email_opened" => counts.email_opened += 1,
                        "login_successful" => counts.login_successful += 1,
                        "user_avatar_updated" => counts.user_avatar_updated += 1,
                        "app_opened" => counts.app_opened += 1,
                        "notification_clicked" => counts.notification_clicked += 1,
                        "app_crashed" => counts.app_crashed += 1,
                        "app_native_crash" => counts.app_native_crash += 1,
                        "oauth2_authorize_accepted" => counts.oauth2_authorize_accepted += 1,
                        "remote_auth_login" => counts.remote_auth_login += 1,
                        "captcha_served" => counts.captcha_served += 1,
                        "voice_message_recorded" => counts.voice_message_recorded += 1,
                        "message_reported" => counts.message_reported += 1,
                        "message_edited" => counts.message_edited += 1,
                        "premium_upsell_viewed" => counts.premium_upsell_viewed += 1,
                        "add_reaction" => counts.add_reaction += 1,
                        "guild_joined" => counts.guild_joined += 1,
                        "join_voice_channel" => counts.join_voice_channel += 1,
                        "leave_voice_channel" => counts.leave_voice_channel += 1,
                        "application_command_used" => {
                            if let Ok(command) =
                                simd_json::from_slice::<ApplicationCommandUsed>(&mut line)
                            {
                                if let Some(cmd) = counts
                                    .most_used_commands
                                    .par_iter_mut()
                                    .find_first(|c| c.command_id == command.command_id)
                                {
                                    cmd.count += 1;
                                    if cmd.command_name.is_none() && command.command_name.is_some()
                                    {
                                        cmd.command_name = command.command_name
                                    }
                                    if cmd.command_description.is_none()
                                        && command.command_description.is_some()
                                    {
                                        cmd.command_description = command.command_description
                                    }
                                } else {
                                    counts.most_used_commands.push(MostUsedCommand {
                                        command_id: command.command_id,
                                        application_id: command.application_id,
                                        command_name: command.command_name,
                                        command_description: command.command_description,
                                        count: 1,
                                    });
                                }
                            }
                            counts.application_command_used += 1
                        }
                        _ => {}
                    }
                }
            });

            if lines_in_batch < batch_size {
                break;
            }
        }

        callback.progress(
            crate::parser::Step::Analytics,
            format!(
                "Analytics processing complete: {} lines processed",
                processed_lines
            ),
        );

        let result = match counts.lock() {
            Ok(mut lock) => {
                lock.most_used_commands
                    .sort_by(|a, b| b.count.cmp(&a.count));
                lock.most_used_commands.truncate(20);
                lock.clone()
            }
            Err(_) => EventCount::default(),
        };

        Ok(result)
    }

    fn determine_resources(&self) -> (usize, usize) {
        let mut system = System::new_all();
        system.refresh_all();

        let total_memory = system.available_memory() as usize;
        let cpu_cores = system.cpus().iter().count();

        let buffer_capacity = std::cmp::min(512 * 1024, total_memory / 4);
        let batch_size = std::cmp::max(1000, cpu_cores * 1000);

        (buffer_capacity, batch_size)
    }
}
