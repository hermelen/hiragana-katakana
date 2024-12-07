use crate::service::constant::DB_URL;
use tokio_postgres::NoTls;

pub async fn init_db() -> Result<(), Box<dyn std::error::Error>> {
    let (client, connection) = tokio_postgres::connect(DB_URL, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            println!("Connection error: {}", e);
        }
    });
    println!("Connected to the database");
    client
        .batch_execute(
            r#"
        CREATE TABLE IF NOT EXISTS syllable (
            id uuid DEFAULT gen_random_uuid(),
            roman VARCHAR NOT NULL,
            hiragana VARCHAR NOT NULL,
            katakana VARCHAR NOT NULL, 
            kanji VARCHAR NULL
        );
        CREATE TABLE IF NOT EXISTS word (
            id uuid DEFAULT gen_random_uuid(),
            roman VARCHAR NOT NULL,
            hiragana VARCHAR NULL,
            katakana VARCHAR NULL,
            kanji VARCHAR NULL
        );
        CREATE TABLE IF NOT EXISTS "user" (
            id uuid DEFAULT gen_random_uuid(),
            username VARCHAR NOT NULL,
            email VARCHAR NOT NULL,
            password VARCHAR NOT NULL,
            is_admin BOOLEAN NOT NULL DEFAULT FALSE
        );
        "#,
        )
        .await?;

    Ok(())
}
