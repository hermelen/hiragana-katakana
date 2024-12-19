mod db;
mod error;
mod user;
mod word;
mod syllable;
mod config;
mod server;
mod service;


use anyhow::Result;
use dotenvy::dotenv;
use crate::config::Config;
use crate::db::init_db;
use crate::error::handle_error;

#[tokio::main]
async fn main() {
    configure_logger();

    handle_error(try_main).await;
}

fn configure_logger() {
    #[cfg(debug_assertions)]
    tracing_subscriber::fmt()
        .with_target(false)
        .compact()
        .init();

    #[cfg(not(debug_assertions))]
    tracing_subscriber::fmt()
        .json()
        .with_max_level(Level::INFO)
        .with_current_span(false)
        .init();
}

async fn try_main() -> Result<()> {
    dotenv().ok();

    let config = Config::load();
    let db = init_db().await?;

    server::handle_client(db, config).await?;

    Ok(())
}
