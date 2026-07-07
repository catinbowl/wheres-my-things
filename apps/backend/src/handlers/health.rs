use axum::{extract::State, Json};
use sqlx::PgPool;
use crate::models::HealthResponse;

pub async fn health(State(pool): State<PgPool>) -> Json<HealthResponse> {
    let db_status = match sqlx::query("SELECT 1").execute(&pool).await {
        Ok(_) => "up",
        Err(_) => "down",
    };

    Json(HealthResponse {
        status: "ok",
        database: db_status,
        allocator: "tcmalloc",
    })
}
