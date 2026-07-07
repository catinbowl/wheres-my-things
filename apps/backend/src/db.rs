pub async fn create_db_if_not_exist(database_url: &str) {
    use sqlx::postgres::{PgConnectOptions, PgConnection};
    use sqlx::Connection;
    use std::str::FromStr;

    let options = PgConnectOptions::from_str(database_url)
        .expect("Failed to parse DATABASE_URL");

    let db_name = match options.get_database() {
        Some(db) => db.to_string(),
        None => return,
    };

    // Connect to "postgres" database instead to create the target db
    let admin_options = options.clone().database("postgres");

    println!("Connecting to 'postgres' system database to check/create '{}'...", db_name);
    let mut conn = PgConnection::connect_with(&admin_options)
        .await
        .expect("Failed to connect to 'postgres' system database");

    let exists: Option<i32> = sqlx::query_scalar("SELECT 1 FROM pg_database WHERE datname = $1")
        .bind(&db_name)
        .fetch_optional(&mut conn)
        .await
        .expect("Failed to query pg_database");

    if exists.is_none() {
        println!("Database '{}' does not exist. Creating...", db_name);
        let create_query = format!("CREATE DATABASE \"{}\"", db_name.replace('"', "\"\""));
        sqlx::query(sqlx::AssertSqlSafe(create_query))
            .execute(&mut conn)
            .await
            .expect("Failed to create database");
        println!("Database '{}' created successfully!", db_name);
    } else {
        println!("Database '{}' already exists.", db_name);
    }
}
