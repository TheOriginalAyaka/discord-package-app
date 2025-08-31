#[derive(Debug, Clone, uniffi::Record)]
pub struct TopChannel {
    pub id: String,
    pub name: Option<String>,
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
