use crate::models::{EventCount, UserData};

#[uniffi::export(with_foreign)]
pub trait ExtractObserver: Send + Sync {
    fn on_progress(&self, progress: OnProgress);
    fn on_error(&self, error: OnError);
    fn on_complete(&self, result: UserData);
    fn on_analytics_complete(&self, result: EventCount);
}

#[derive(Debug, uniffi::Record)]
pub struct OnProgress {
    pub step: String,
    pub message: String,
}

#[derive(Debug, uniffi::Record)]
pub struct OnError {
    pub step: String,
    pub message: String,
    pub title: String,
}
