use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Channel {
    pub id: String,
    pub recipients: Option<Vec<String>>,
    pub guild: Option<Guild>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Guild {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TopChannel {
    pub id: String,
    pub name: String,
    pub message_count: u32,
    pub guild_name: Option<String>,
    pub guild_id: Option<String>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct TopDM {
    pub id: String,
    pub dm_user_id: String,
    pub message_count: u32,
}
