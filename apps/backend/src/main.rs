use axum::{routing::get, Json, Router};
use serde::Serialize;
use std::net::SocketAddr;
use tcmalloc::TCMalloc;

#[global_allocator]
static ALLOCATOR: TCMalloc = TCMalloc;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    allocator: &'static str,
}

#[tokio::main]
async fn main() {
    // build our application with a route
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health));

    // run our app with hyper, listening globally on port 3000
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    println!("listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> &'static str {
    "Welcome to Wheres My Things Backend API"
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        allocator: "tcmalloc",
    })
}
