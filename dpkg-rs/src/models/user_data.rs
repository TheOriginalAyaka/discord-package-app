use super::channel::{TopChannel, TopDM};
use super::message::FavoriteWord;
use super::user::User;

#[derive(Debug, Clone, uniffi::Record)]
pub struct UserData {
    pub user: Option<User>,
    pub top_dms: Vec<TopDM>,
    pub top_channels: Vec<TopChannel>,
    pub guild_count: u32,
    pub dm_channel_count: u32,
    pub channel_count: u32,
    pub message_count: u32,
    pub character_count: u32,
    pub hours_values: Vec<u32>,
    pub favorite_words: Vec<FavoriteWord>,
}

impl Default for UserData {
    fn default() -> Self {
        Self {
            user: None,
            top_dms: Vec::new(),
            top_channels: Vec::new(),
            guild_count: 0,
            dm_channel_count: 0,
            channel_count: 0,
            message_count: 0,
            character_count: 0,
            hours_values: vec![0; 24],
            favorite_words: Vec::new(),
        }
    }
}
