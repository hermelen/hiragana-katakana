use anyhow::{Context, Result};
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use uuid::{NoContext, Timestamp, Uuid};

pub fn new_uuid() -> Uuid {
    let ts = Timestamp::now(NoContext);
    Uuid::new_v7(ts)
}

pub async fn init_db(database_url: &str) -> Result<PgPool> {
    let db = PgPoolOptions::new()
        .max_connections(50)
        .connect(database_url)
        .await
        .context("could not connect to database_url")?;

    sqlx::migrate!("./migrations/").run(&db).await?;

    Ok(db)
}
