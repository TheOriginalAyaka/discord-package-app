use serde::{Deserialize, Deserializer};

#[derive(Debug, Deserialize)]
pub struct DChannel {
    pub id: String,
    pub name: Option<String>,
    #[serde(deserialize_with = "deserialize_type_field")]
    pub r#type: Option<String>,
    pub recipients: Option<Vec<String>>,
    pub guild: Option<DGuild>,
}

#[derive(Debug, Deserialize, Clone, uniffi::Record)]
pub struct DGuild {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct DMessage {
    #[serde(rename = "ID")]
    pub id: u64,
    #[serde(rename = "Timestamp")]
    pub timestamp: String,
    #[serde(rename = "Contents")]
    pub contents: String,
    #[serde(rename = "Attachments")]
    pub attachments: String,
}

#[derive(Debug, Deserialize, Default)]
pub struct DApplicationCommandUsed {
    pub application_id: String,
    pub command_id: String,
    pub command_name: Option<String>,
    pub command_description: Option<String>,
}

fn deserialize_type_field<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: Deserializer<'de>,
{
    use serde_json::Value;
    let value: Option<Value> = Option::deserialize(deserializer)?;

    match value {
        Some(Value::String(s)) => Ok(Some(s)),
        Some(Value::Number(n)) => Ok(Some(n.to_string())),
        _ => Ok(None),
    }
}
