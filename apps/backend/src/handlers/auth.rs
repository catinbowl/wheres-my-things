use axum::{
    extract::State,
    http::{header::SET_COOKIE, HeaderMap, StatusCode},
    Json,
};
use sqlx::PgPool;
use uuid::Uuid;
use chrono::Utc;
use crate::models::{DbUser, UserResponse, UserWrapper, SignUpRequest, SignInRequest};

pub fn extract_session_token(headers: &HeaderMap) -> Option<String> {
    let cookie_header = headers.get("cookie")?.to_str().ok()?;
    let session_cookie = cookie_header
        .split(';')
        .find(|s| s.trim().starts_with("session="))?;
    let token = session_cookie.split('=').nth(1)?.trim();
    Some(token.to_string())
}

pub async fn signup(
    State(pool): State<PgPool>,
    Json(payload): Json<SignUpRequest>,
) -> Result<(HeaderMap, Json<UserWrapper>), (StatusCode, Json<serde_json::Value>)> {
    let password_str = payload.password.as_deref().unwrap_or("");
    if payload.username.is_empty() || payload.email.is_empty() || password_str.is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": "Username, email, and password are required" }))));
    }

    // Check username uniqueness
    let existing: Option<sqlx::postgres::PgRow> = sqlx::query(
        "SELECT uid FROM users WHERE username = $1"
    )
    .bind(&payload.username)
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    if existing.is_some() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": "Username is already taken" }))));
    }

    // Hash password
    let password_hash = bcrypt::hash(password_str, bcrypt::DEFAULT_COST)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    let user_uid = Uuid::new_v4();
    let now = Utc::now().naive_utc();

    let user: DbUser = sqlx::query_as(
        r#"
        INSERT INTO users (uid, username, email, password, "isSubscribed", "subscriptionEnds", "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING uid, username, email, password, "isSubscribed", "subscriptionEnds"
        "#
    )
    .bind(user_uid)
    .bind(&payload.username)
    .bind(&payload.email)
    .bind(&password_hash)
    .bind(false)
    .bind("")
    .bind(now)
    .bind(now)
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    // Create session
    let session_token = Uuid::new_v4().to_string();
    let expires_at = Utc::now() + chrono::Duration::days(30);

    sqlx::query(
        r#"INSERT INTO sessions (token, "userID", "expiresAt") VALUES ($1, $2, $3)"#
    )
    .bind(&session_token)
    .bind(user.uid)
    .bind(expires_at.naive_utc())
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    let cookie = format!("session={}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000", session_token);
    let mut response_headers = HeaderMap::new();
    response_headers.insert(SET_COOKIE, cookie.parse().unwrap());

    Ok((response_headers, Json(UserWrapper {
        user: UserResponse {
            id: user.uid,
            username: user.username,
            email: user.email,
            is_subscribed: user.is_subscribed,
            subscription_ends: user.subscription_ends,
        }
    })))
}

pub async fn signin(
    State(pool): State<PgPool>,
    Json(payload): Json<SignInRequest>,
) -> Result<(HeaderMap, Json<UserWrapper>), (StatusCode, Json<serde_json::Value>)> {
    let password_str = payload.password.as_deref().unwrap_or("");
    if payload.email.is_empty() || password_str.is_empty() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({ "error": "Email and password are required" }))));
    }

    let user: DbUser = sqlx::query_as(
        r#"
        SELECT uid, username, email, password, "isSubscribed", "subscriptionEnds"
        FROM users
        WHERE email = $1
        "#
    )
    .bind(&payload.email)
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?
    .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "Invalid email or password" }))))?;

    let password_ok = bcrypt::verify(password_str, &user.password)
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    if !password_ok {
        return Err((StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "Invalid email or password" }))));
    }

    // Create session
    let session_token = Uuid::new_v4().to_string();
    let expires_at = Utc::now() + chrono::Duration::days(30);

    sqlx::query(
        r#"INSERT INTO sessions (token, "userID", "expiresAt") VALUES ($1, $2, $3)"#
    )
    .bind(&session_token)
    .bind(user.uid)
    .bind(expires_at.naive_utc())
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?;

    let cookie = format!("session={}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000", session_token);
    let mut response_headers = HeaderMap::new();
    response_headers.insert(SET_COOKIE, cookie.parse().unwrap());

    Ok((response_headers, Json(UserWrapper {
        user: UserResponse {
            id: user.uid,
            username: user.username,
            email: user.email,
            is_subscribed: user.is_subscribed,
            subscription_ends: user.subscription_ends,
        }
    })))
}

pub async fn validate(
    State(pool): State<PgPool>,
    headers: HeaderMap,
) -> Result<Json<UserWrapper>, (StatusCode, Json<serde_json::Value>)> {
    let token = extract_session_token(&headers)
        .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "No session found" }))))?;

    let user: DbUser = sqlx::query_as(
        r#"
        SELECT u.uid, u.username, u.email, u.password, u."isSubscribed", u."subscriptionEnds"
        FROM sessions s
        JOIN users u ON s."userID" = u.uid
        WHERE s.token = $1 AND s."expiresAt" > $2
        "#
    )
    .bind(&token)
    .bind(Utc::now().naive_utc())
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({ "error": e.to_string() }))))?
    .ok_or_else(|| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({ "error": "Invalid or expired session" }))))?;

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

pub async fn logout(
    State(pool): State<PgPool>,
    headers: HeaderMap,
) -> Result<(HeaderMap, Json<serde_json::Value>), (StatusCode, Json<serde_json::Value>)> {
    if let Some(token) = extract_session_token(&headers) {
        let _ = sqlx::query("DELETE FROM sessions WHERE token = $1")
            .bind(&token)
            .execute(&pool)
            .await;
    }

    let cookie = "session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    let mut response_headers = HeaderMap::new();
    response_headers.insert(SET_COOKIE, cookie.parse().unwrap());

    Ok((response_headers, Json(serde_json::json!({ "status": "ok" }))))
}
