use anyhow::{Result, anyhow};
use regex::Regex;
use serde::Deserialize;
use std::io::{BufReader, Read};
use zip::ZipArchive;

use crate::parser::Parser;

impl Parser {
    pub(crate) fn read_file<R: Read + std::io::Seek>(
        &self,
        archive: &mut ZipArchive<R>,
        path: &str,
    ) -> Result<Option<String>> {
        if let Some(&index) = self.file_index.get(path) {
            let file = archive.by_index(index)?;
            let mut content = String::new();
            let mut reader = BufReader::new(file);
            use std::io::Read as _;
            reader.read_to_string(&mut content)?;
            let cleaned_content = content.trim_start_matches('\u{FEFF}').trim();
            if cleaned_content.is_empty() {
                println!("[debug] Warning: File {} is empty", path);
                return Ok(None);
            }
            return Ok(Some(cleaned_content.to_string()));
        }
        Ok(None)
    }

    pub(crate) fn parse_json<T>(&self, content: &str) -> Result<T>
    where
        T: for<'de> Deserialize<'de>,
    {
        if content.trim().is_empty() {
            return Err(anyhow!("Empty JSON content"));
        }
        let trimmed = content.trim();
        if !trimmed.starts_with('{') && !trimmed.starts_with('[') {
            return Err(anyhow!("Invalid JSON format - doesn't start with {{ or ["));
        }
        let mut data = content.as_bytes().to_vec();
        match simd_json::from_slice::<T>(&mut data) {
            Ok(result) => {
                println!("[debug] Successfully parsed with simd_json");
                Ok(result)
            }
            Err(e) => {
                println!(
                    "[debug] simd_json failed: {}, falling back to serde_json",
                    e
                );
                match serde_json::from_str::<T>(content) {
                    Ok(result) => {
                        println!("[debug] Successfully parsed with serde_json");
                        Ok(result)
                    }
                    Err(e2) => Err(anyhow!(
                        "Both JSON parsers failed. serde_json: {}",
                        e2
                    )),
                }
            }
        }
    }

    pub(crate) fn file_exists(&self, path: &str) -> bool {
        self.file_index.contains_key(path)
    }

    pub(crate) fn process_words(content: &str) -> Vec<String> {
        content.split_whitespace().map(|s| s.to_string()).collect()
    }

    pub(crate) fn get_messages_root(files: &[&String]) -> Result<String> {
        let regex = Regex::new(r"/c?[0-9]{16,32}/channel\.json$")?;
        let sample = files
            .iter()
            .find(|f| regex.is_match(f.as_str()))
            .ok_or_else(|| anyhow!("Could not find Messages folder structure"))?;
        let segments: Vec<&str> = sample.split('/').collect();
        Ok(segments[..segments.len() - 2].join("/"))
    }

    pub(crate) fn get_servers_root(files: &[&String]) -> Result<String> {
        let regex = Regex::new(r"/[0-9]{16,32}/guild\.json$")?;
        let sample = files
            .iter()
            .find(|f| regex.is_match(f.as_str()))
            .ok_or_else(|| anyhow!("Could not find Servers folder structure"))?;
        let segments: Vec<&str> = sample.split('/').collect();
        Ok(segments[..segments.len() - 2].join("/"))
    }

    pub(crate) fn get_user_root(files: &[&String]) -> Result<String> {
        let regex = Regex::new(r"^([^/]+)/user\.json$")?;
        let sample = files
            .iter()
            .find(|f| regex.is_match(f.as_str()))
            .ok_or_else(|| anyhow!("Could not find User folder structure"))?;
        let segments: Vec<&str> = sample.split('/').collect();
        Ok(segments[..segments.len() - 1].join("/"))
    }
}
