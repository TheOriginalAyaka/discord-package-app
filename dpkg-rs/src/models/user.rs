use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DUser {
    pub id: String,
    pub username: String,
    pub global_name: Option<String>,
    pub discriminator: u16,
    pub avatar_hash: Option<String>,
    pub payments: Vec<DPayment>,
    pub relationships: Vec<DRelationship>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DRelationship {
    pub user: DRelationshipUser,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DRelationshipUser {
    pub id: String,
    pub username: String,
    pub global_name: Option<String>,
    pub discriminator: String,
    pub avatar: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct DPayment {
    pub status: i32,
    pub currency: String,
    pub amount: i64,
    pub created_at: String,
    pub description: String,
}
