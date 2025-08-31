use serde::Deserialize;

#[derive(Deserialize)]
pub struct Event {
    pub event_type: String,
}

#[derive(Debug, Default, Clone, uniffi::Record)]
pub struct EventCount {
    pub application_created: u32,
    pub bot_token_compromised: u32,
    pub email_opened: u32,
    pub login_successful: u32,
    pub user_avatar_updated: u32,
    pub app_opened: u32,
    pub notification_clicked: u32,
    pub app_crashed: u32,
    pub app_native_crash: u32,
    pub oauth2_authorize_accepted: u32,
    pub remote_auth_login: u32,
    pub captcha_served: u32,
    pub voice_message_recorded: u32,
    pub message_reported: u32,
    pub message_edited: u32,
    pub premium_upsell_viewed: u32,
    pub application_command_used: u32,
    pub add_reaction: u32,
    pub guild_joined: u32,
    pub join_voice_channel: u32,
    pub leave_voice_channel: u32,
    pub most_used_commands: Vec<MostUsedCommand>,
    pub all_events: u32,
}

#[derive(Debug, Default, Clone, uniffi::Record)]
pub struct MostUsedCommand {
    pub command_id: String,
    pub application_id: String,
    pub command_name: Option<String>,
    pub command_description: Option<String>,
    pub count: u32,
}
