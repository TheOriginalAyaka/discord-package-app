use super::channel::{TopChannel, TopDM};
use super::message::FavoriteWord;
use super::user::User;

#[derive(Debug, Clone, Default, uniffi::Record)]
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
