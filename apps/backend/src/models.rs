use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub database: &'static str,
    pub allocator: &'static str,
}

#[derive(FromRow, Clone)]
pub struct DbUser {
    pub uid: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
    #[sqlx(rename = "isSubscribed")]
    pub is_subscribed: bool,
    #[sqlx(rename = "subscriptionEnds")]
    pub subscription_ends: String,
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub is_subscribed: bool,
    pub subscription_ends: String,
}

#[derive(Serialize)]
pub struct UserWrapper {
    pub user: UserResponse,
}

#[derive(Deserialize)]
pub struct SignUpRequest {
    pub username: String,
    pub email: String,
    pub password: Option<String>,
}

#[derive(Deserialize)]
pub struct SignInRequest {
    pub email: String,
    pub password: Option<String>,
}

#[derive(Deserialize)]
pub struct SubscribeRequest {
    #[serde(rename = "planId")]
    pub plan_id: String,
}

#[derive(Deserialize)]
pub struct CheckUsernameQuery {
    pub username: String,
}

#[derive(Serialize)]
pub struct CheckUsernameResponse {
    pub available: bool,
    pub message: String,
}

