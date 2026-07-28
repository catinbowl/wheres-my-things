use axum::{
    http::Method,
    routing::{get, post},
    Router,
};
use sqlx::postgres::PgPoolOptions;
use std::net::SocketAddr;
use tower_http::cors::{AllowOrigin, CorsLayer};
use tower_http::trace::TraceLayer;
use tcmalloc::TCMalloc;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod db;
mod models;
mod handlers;

#[global_allocator]
static ALLOCATOR: TCMalloc = TCMalloc;

#[tokio::main]
async fn main() {
    // Initialize tracing subscriber for terminal logs
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "backend=info,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load .env file variables
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL environment variable must be set");

    db::create_db_if_not_exist(&database_url).await;

    println!("Connecting to database...");
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create database connection pool");

    println!("Running database migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run database migrations");
    println!("Database migrations ran successfully!");

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::mirror_request())
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([
            axum::http::header::CONTENT_TYPE,
            axum::http::header::COOKIE,
        ])
        .allow_credentials(true);

    // Build routes
    let app = Router::new()
        .route("/", get(handlers::root))
        .route("/health", get(handlers::health::health))
        .route("/signup", post(handlers::auth::signup))
        .route("/signin", post(handlers::auth::signin))
        .route("/validate", get(handlers::auth::validate))
        .route("/logout", get(handlers::auth::logout))
        .route("/check-username", get(handlers::auth::check_username))
        .route("/users/subscribe", post(handlers::subscribe::subscribe))
        .layer(TraceLayer::new_for_http())
        .layer(cors)
        .with_state(pool);


    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}
