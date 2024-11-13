use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use tokio;
use tokio::main;
use tokio_postgres::{NoTls, Row};
use uuid::Uuid;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
struct Syllable {
    id: Option<Uuid>,
    roman: String,
    hiragana: String,
    katakana: String,
    kanji: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct Word {
    id: Option<Uuid>,
    roman: String,
    hiragana: Option<String>,
    katakana: Option<String>,
    kanji: Option<String>,
}

trait FromRow {
    fn from_row(row: Row) -> Self;
}

// DATABASE URL
const DB_URL: &str = "postgresql://postgres:postgres@localhost:6000/postgres";

const OK_RESPONSE: &str = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Allow-Methods: GET, POST, PUT, DELETE\r\nAccess-Control-Allow-Headers: Content-Type\r\n\r\n";
const NOT_FOUND: &str = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
const INTERNAL_ERROR: &str = "HTTP/1.1 500 INTERNAL ERROR\r\n\r\n";

#[main]
async fn main() {
    // Set up the database asynchronously
    if let Err(e) = set_database().await {
        println!("Error setting database: {}", e);
        return;
    }

    // Start TCP listener
    let listener = TcpListener::bind("0.0.0.0:8000").unwrap();
    println!("Server listening on port 8000");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                // Handle the client connection
                handle_client(stream).await;
            }
            Err(e) => {
                println!("Unable to connect: {}", e);
            }
        }
    }
}

async fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    let mut request = String::new();

    match stream.read(&mut buffer) {
        Ok(size) => {
            request.push_str(String::from_utf8_lossy(&buffer[..size]).as_ref());

            let (status_line, content) = match &*request {
                r if r.starts_with("OPTIONS") => (OK_RESPONSE.to_string(), "".to_string()),
                r if r.starts_with("POST /api/rust/word") => handle_post_words_request(r).await,
                r if r.starts_with("POST /api/rust/syllable") => handle_post_syllables_request(r).await,
                r if r.starts_with("GET /api/rust/word/") => handle_get_words_request(r).await,
                r if r.starts_with("GET /api/rust/syllable/") => handle_get_syllables_request(r).await,
                r if r.starts_with("GET /api/rust/word") => handle_get_all_words_request(r).await,
                r if r.starts_with("GET /api/rust/syllable") => {handle_get_all_syllables_request(r).await}
                r if r.starts_with("PUT /api/rust/word/") => handle_put_words_request(r).await,
                r if r.starts_with("PUT /api/rust/syllable/") => handle_put_syllables_request(r).await,
                r if r.starts_with("DELETE /api/rust/word/") => handle_delete_words_request(r).await,
                r if r.starts_with("DELETE /api/rust/syllable/") => {handle_delete_syllables_request(r).await}
                _ => (NOT_FOUND.to_string(), "404 not found".to_string()),
            };

            stream
                .write_all(format!("{}{}", status_line, content).as_bytes())
                .unwrap();
        }
        Err(e) => eprintln!("Unable to read stream: {}", e),
    }
}

async fn handle_post_words_request(request: &str) -> (String, String) {
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

async fn handle_post_syllables_request(request: &str) -> (String, String) {
    match (
        get_syllable_request_body(request),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(syllable), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .query_one(
                    "INSERT INTO word (roman, hiragana, katakana, kanji) VALUES ($1, $2, $3, $4) RETURNING id",
                    &[&syllable.roman, &syllable.hiragana, &syllable.katakana, &syllable.kanji],
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
                            let syllable: Syllable = new_from_row(row).await;
                            (OK_RESPONSE.to_string(), serde_json::to_string(&syllable).unwrap())
                        }
                        Err(_) => (
                            INTERNAL_ERROR.to_string(),
                            "Failed to retrieve created syllable".to_string(),
                        ),
                    }
                }
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to insert syllable".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

async fn handle_get_words_request(request: &str) -> (String, String) {
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

async fn handle_get_syllables_request(request: &str) -> (String, String) {
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
                .query_one("SELECT * FROM syllable WHERE id = $1", &[&id])
                .await
            {
                Ok(row) => {
                    let syllable: Syllable = new_from_row(row).await;
                    (
                        OK_RESPONSE.to_string(),
                        serde_json::to_string(&syllable).unwrap(),
                    )
                }
                _ => (NOT_FOUND.to_string(), "syllable not found".to_string()),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

async fn handle_get_all_words_request(_request: &str) -> (String, String) {
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

async fn handle_get_all_syllables_request(_request: &str) -> (String, String) {
    match tokio_postgres::connect(DB_URL, NoTls).await {
        Ok((client, connection)) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            let mut syllables = Vec::new();

            for row in client.query("SELECT * FROM syllable", &[]).await.unwrap() {
                let syllable: Syllable = new_from_row(row).await;
                syllables.push(syllable);
            }
            (
                OK_RESPONSE.to_string(),
                serde_json::to_string(&syllables).unwrap(),
            )
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

async fn handle_put_words_request(request: &str) -> (String, String) {
    match (get_id(&request).parse::<Uuid>(), get_word_request_body(&request), tokio_postgres::connect(DB_URL, NoTls).await,
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


async fn handle_put_syllables_request(request: &str) -> (String, String) {
    match (get_id(&request).parse::<Uuid>(), get_syllable_request_body(&request), tokio_postgres::connect(DB_URL, NoTls).await
    ) {
        (Ok(id), Ok(syllable), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .execute("UPDATE syllable SET roman = $1, hiragana = $2, katakana = $3, kanji = $4 WHERE id = $5",
                    &[&syllable.roman, &syllable.hiragana, &syllable.katakana, &syllable.kanji, &id],)
                .await
            {
                Ok(_) => (OK_RESPONSE.to_string(), "Word updated".to_string()),
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to update syllable".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

async fn handle_delete_words_request(request: &str) -> (String, String) {
    match (get_id(&request).parse::<Uuid>(), tokio_postgres::connect(DB_URL, NoTls).await) {
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

async fn handle_delete_syllables_request(request: &str) -> (String, String) {
    match (get_id(&request).parse::<Uuid>(), tokio_postgres::connect(DB_URL, NoTls).await) {
        (Ok(id), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Connection error: {}", e);
                }
            });

            match client
                .execute("DELETE FROM syllable WHERE id = $1", &[&id])
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
                    "Failed to delete syllable".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

async fn set_database() -> Result<(), Box<dyn std::error::Error>> {
    let (client, connection) = tokio_postgres::connect(DB_URL, NoTls).await?;

    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("Connection error: {}", e);
        }
    });

    client.batch_execute(
        "
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
        "
    ).await?;

    Ok(())
}

fn get_id(request: &str) -> &str {
    request
        .split("/")
        .nth(4)
        .unwrap_or_default()
        .split_whitespace()
        .next()
        .unwrap_or_default()
}

fn get_word_request_body(request: &str) -> Result<Word, serde_json::Error> {
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}

fn get_syllable_request_body(request: &str) -> Result<Syllable, serde_json::Error> {
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}

impl FromRow for Word {
    fn from_row(row: Row) -> Self {
        Word {
            id: Some(row.get(0)),
            roman: row.get(1),
            hiragana: row.get::<_, Option<String>>(2),
            katakana: row.get::<_, Option<String>>(3),
            kanji: row.get::<_, Option<String>>(4),
        }
    }
}

impl FromRow for Syllable {
    fn from_row(row: Row) -> Self {
        Syllable {
            id: Some(row.get(0)),
            roman: row.get(1),
            hiragana: row.get(2),
            katakana: row.get(3),
            kanji: row.get::<_, Option<String>>(4),
        }
    }
}

async fn new_from_row<T: FromRow>(row: Row) -> T {
    T::from_row(row)
}
