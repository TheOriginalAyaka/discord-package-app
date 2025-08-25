use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, uniffi::Record)]
pub struct Payment {
    pub status: i32,
    pub currency: String,
    pub amount: i64,
    pub created_at: String,
    pub description: String,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct PaymentInfo {
    pub total: HashMap<String, f64>,
    pub list: String,
}
