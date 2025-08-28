use std::sync::Arc;

use crate::models::{EventCount, ExtractObserver, OnError, OnProgress, UserData};

pub struct Callback {
    observer: Arc<dyn ExtractObserver>,
}

impl Callback {
    pub fn new(observer: Arc<dyn ExtractObserver>) -> Self {
        Self { observer }
    }

    pub fn progress(&self, step: Step, message: String) {
        self.observer.on_progress(OnProgress {
            step: step.to_string(),
            message,
        });
    }

    pub fn error(&self, step: Step, message: String, title: String) {
        self.observer.on_error(OnError {
            step: step.to_string(),
            message,
            title,
        });
    }

    pub fn data_complete(&self, data: UserData) {
        self.observer.on_complete(data);
    }

    pub fn analytics_complete(&self, data: EventCount) {
        self.observer.on_analytics_complete(data);
    }
}
pub enum Step {
    Messages,
    Analytics,
    Scaffolding,
}

#[allow(clippy::to_string_trait_impl)]
impl ToString for Step {
    fn to_string(&self) -> String {
        match self {
            Step::Scaffolding => "scaffolding".to_string(),
            Step::Messages => "messages".to_string(),
            Step::Analytics => "analytics".to_string(),
        }
    }
}
