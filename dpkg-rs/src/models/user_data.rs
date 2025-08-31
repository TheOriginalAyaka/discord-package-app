use crate::models::DGuild;

use super::channel::{TopChannel, TopDM};
use super::message::WordCount;
use super::user::DUser;

#[derive(Debug, Clone, uniffi::Record)]
pub struct UserData {
    pub user: Option<DUser>,
    pub top_dms: Vec<TopDM>,
    pub top_channels: Vec<TopChannel>,
    pub guilds: Vec<DGuild>,
    pub dm_channel_count: u32,
    pub channel_count: u32,
    pub message_count: u32,
    pub character_count: u32,
    pub hours_values: Vec<u32>,
    pub favorite_words: Vec<WordCount>,
    pub favorite_emotes: Vec<WordCount>,
}

impl Default for UserData {
    fn default() -> Self {
        Self {
            user: None,
            top_dms: Vec::new(),
            top_channels: Vec::new(),
            guilds: Vec::new(),
            dm_channel_count: 0,
            channel_count: 0,
            message_count: 0,
            character_count: 0,
            hours_values: vec![0; 24],
            favorite_words: Vec::new(),
            favorite_emotes: Vec::new(),
        }
    }
}
