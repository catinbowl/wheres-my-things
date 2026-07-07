use axum::{extract::State, http::{HeaderMap, StatusCode}, Json};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;
use crate::models::{DbUser, UserResponse, UserWrapper, SubscribeRequest};
use crate::handlers::auth::extract_session_token;

pub async fn subscribe(
    State(pool): State<PgPool>,
    headers: HeaderMap,
    Json(payload): Json<SubscribeRequest>,
) -> Result<Json<UserWrapper>, (StatusCode, Json<serde_json::Value>)> {
    let token = extract_session_token(&headers)
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "No session found" }))))?;

    let session_user_id: Uuid = sqlx::query_scalar(
        r#"
        SELECT "userID"
        FROM sessions
        WHERE token = $1 AND "expiresAt" > $2
        "#
    )
    .bind(&token)
    .bind(Utc::now().naive_utc())
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?
    .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "Invalid or expired session" }))))?;

    let is_subscribed = payload.plan_id != "free";
    let subscription_ends = if payload.plan_id == "pro" {
        let end_date = Utc::now() + chrono::Duration::days(30);
        end_date.to_rfc3339()
    } else if payload.plan_id == "premium" {
        let end_date = Utc::now() + chrono::Duration::days(365);
        format!("{} (yr)", end_date.to_rfc3339())
    } else {
        "".to_string()
    };

    let user: DbUser = sqlx::query_as(
        r#"
        UPDATE users
        SET "isSubscribed" = $1, "subscriptionEnds" = $2, "updatedAt" = $3
        WHERE uid = $4
        RETURNING uid, username, email, password, "isSubscribed", "subscriptionEnds"
        "#
    )
    .bind(is_subscribed)
    .bind(&subscription_ends)
    .bind(Utc::now().naive_utc())
    .bind(session_user_id)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    Ok(Json(UserWrapper {
        user: UserResponse {
            id: user.uid,
            username: user.username,
            email: user.email,
            is_subscribed: user.is_subscribed,
            subscription_ends: user.subscription_ends,
        }
    }))
}
