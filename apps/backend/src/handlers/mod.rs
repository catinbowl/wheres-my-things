pub mod auth;
pub mod health;
pub mod subscribe;

pub async fn root() -> &'static str {
    "Welcome to Wheres My Things Backend API"
}
