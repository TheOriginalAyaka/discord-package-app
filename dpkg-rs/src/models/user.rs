use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct User {
    pub id: String,
    pub username: String,
    pub global_name: String,
    pub discriminator: u16,
    pub avatar_hash: Option<String>,
    pub payments: Vec<Payment>,
    pub flags: Vec<String>,
    pub relationships: Vec<Relationship>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Relationship {
    pub user: DiscordUser,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DiscordUser {
    pub id: String,
    pub username: String,
    pub global_name: String,
    pub discriminator: String,
    pub avatar: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Payment {
    pub status: i32,
    pub currency: String,
    pub amount: i64,
    pub created_at: String,
    pub description: String,
}
