#[allow(dead_code)]
#[derive(Debug, Clone)]
pub struct Message {
    pub id: u64,
    pub timestamp: String,
    pub content: String,
    pub attachments: Vec<String>,
    pub length: u32,
    pub words: Vec<String>,
}

#[derive(Debug, Clone, uniffi::Record)]
pub struct WordCount {
    pub word: String,
    pub count: u32,
}
