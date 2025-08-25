use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct User {
    pub id: String,
    pub username: String,
    pub global_name: String,
    pub discriminator: u16,
    pub avatar_hash: Option<String>,
    pub payments: Vec<super::payment::Payment>,
}

// #[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
// pub struct UserData {
//     pub username: String,
//     pub discriminator: u16,
//     pub avatar: Option<String>,
// }
