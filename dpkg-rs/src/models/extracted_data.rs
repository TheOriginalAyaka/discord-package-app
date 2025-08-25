use super::channel::{TopChannel, TopDM};
use super::message::FavoriteWord;
use super::payment::PaymentInfo;
use super::user::User;

#[derive(Debug, Clone, uniffi::Record)]
pub struct ExtractedData {
    pub user: Option<User>,
    pub top_dms: Vec<TopDM>,
    pub top_channels: Vec<TopChannel>,
    pub guild_count: u32,
    pub dm_channel_count: u32,
    pub channel_count: u32,
    pub message_count: u32,
    pub character_count: u32,
    pub total_spent: f64,
    pub hours_values: Vec<u32>,
    pub favorite_words: Vec<FavoriteWord>,
    pub payments: PaymentInfo,
    pub open_count: Option<u32>,
    pub average_open_count_per_day: Option<u32>,
    pub notification_count: Option<u32>,
    pub join_voice_channel_count: Option<u32>,
    pub join_call_count: Option<u32>,
    pub add_reaction_count: Option<u32>,
    pub message_edited_count: Option<u32>,
    pub sent_message_count: Option<u32>,
    pub average_message_count_per_day: Option<u32>,
    pub slash_command_used_count: Option<u32>,
}

impl Default for ExtractedData {
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
            total_spent: 0.0,
            hours_values: vec![0; 24],
            favorite_words: Vec::new(),
            payments: PaymentInfo {
                total: std::collections::HashMap::new(),
                list: String::new(),
            },
            open_count: None,
            average_open_count_per_day: None,
            notification_count: None,
            join_voice_channel_count: None,
            join_call_count: None,
            add_reaction_count: None,
            message_edited_count: None,
            sent_message_count: None,
            average_message_count_per_day: None,
            slash_command_used_count: None,
        }
    }
}
