use crate::service::constant::{DB_URL, INTERNAL_ERROR, NOT_FOUND, OK_RESPONSE};
use crate::service::function::{get_id, new_from_row};
use crate::word::model::Word;
use tokio_postgres::NoTls;
use uuid::Uuid;

pub async fn handle_post_words_request(request: &str) -> (String, String) {
    match (
        get_word_request_body(request),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(word), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .query_one(
                    "INSERT INTO word (roman, hiragana, katakana, kanji) VALUES ($1, $2, $3, $4) RETURNING id",
                    &[&word.roman, &word.hiragana, &word.katakana, &word.kanji],
                )
                .await
            {
                Ok(row) => {
                    let id: Uuid = row.get(0);
                    match client
                        .query_one("SELECT * FROM word WHERE id = $1", &[&id])
                        .await
                    {
                        Ok(row) => {
                            let word: Word = new_from_row(row).await;
                            (OK_RESPONSE.to_string(), serde_json::to_string(&word).unwrap())
                        }
                        Err(_) => (
                            INTERNAL_ERROR.to_string(),
                            "Failed to retrieve created word".to_string(),
                        ),
                    }
                }
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to insert word".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub async fn handle_get_word_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            match client
                .query_one("SELECT * FROM word WHERE id = $1", &[&id])
                .await
            {
                Ok(row) => {
                    let word: Word = new_from_row(row).await;
                    (
                        OK_RESPONSE.to_string(),
                        serde_json::to_string(&word).unwrap(),
                    )
                }
                _ => (NOT_FOUND.to_string(), "Word not found".to_string()),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub async fn handle_get_all_words_request(_request: &str) -> (String, String) {
    match tokio_postgres::connect(DB_URL, NoTls).await {
        Ok((client, connection)) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            let mut words = Vec::new();
            for row in client.query("SELECT * FROM word", &[]).await.unwrap() {
                let word: Word = new_from_row(row).await;
                words.push(word);
            }
            (
                OK_RESPONSE.to_string(),
                serde_json::to_string(&words).unwrap(),
            )
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub async fn handle_put_word_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        get_word_request_body(&request),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok(word), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .execute(
                    "UPDATE word SET roman = $1, hiragana = $2, katakana = $3, kanji = $4 WHERE id = $5",
                    &[&word.roman, &word.hiragana, &word.katakana, &word.kanji, &id],
                )
                .await
            {
                Ok(_) => (OK_RESPONSE.to_string(), "Word updated".to_string()),
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to update word".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub async fn handle_delete_word_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Connection error: {}", e);
                }
            });

            match client
                .execute("DELETE FROM word WHERE id = $1", &[&id])
                .await
            {
                Ok(rows_affected) => {
                    if rows_affected == 0 {
                        return (NOT_FOUND.to_string(), "Syllable not found".to_string());
                    }

                    (OK_RESPONSE.to_string(), "Syllable deleted".to_string())
                }
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to delete word".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

fn get_word_request_body(request: &str) -> Result<Word, serde_json::Error> {
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}
