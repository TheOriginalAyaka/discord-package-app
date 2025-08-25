use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    #[serde(rename = "ID")]
    pub id: u64,
    #[serde(rename = "Timestamp")]
    pub timestamp: String,
    #[serde(rename = "Contents")]
    pub contents: String,
    #[serde(rename = "Attachments")]
    pub attachments: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ParsedMessage {
    pub id: u64,
    pub timestamp: String,
    pub length: u32,
    pub words: Vec<String>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct FavoriteWord {
    pub word: String,
    pub count: u32,
}
