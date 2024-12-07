mod db;
mod syllable;
use crate::db::init_db;
use crate::service::constant::{NOT_FOUND, OK_RESPONSE};
use crate::syllable::syllable_router;
use crate::user::user_router;
use crate::word::word_router;
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use tokio;
use tokio::main;

mod service;
mod user;
mod word;

#[main]
async fn main() {
    // Set up the database asynchronously
    if let Err(e) = init_db().await {
        println!("Error setting database: {}", e);
        return;
    }

    // Start TCP listener
    let listener = TcpListener::bind("0.0.0.0:8000").unwrap();
    println!("Server listening on port 8000");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
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

            let (status_line, content) = if request.starts_with("OPTIONS") {
                (OK_RESPONSE.to_string(), "".to_string())
            } else if let Some(result) = syllable_router(&request).await {
                result
            } else if let Some(result) = word_router(&request).await {
                result
            } else if let Some(result) = user_router(&request).await {
                result
            } else {
                (NOT_FOUND.to_string(), String::from("404 Not Found"))
            };

            stream
                .write_all(format!("{}{}", status_line, content).as_bytes())
                .unwrap();
        }
        Err(e) => eprintln!("Unable to read stream: {}", e),
    }
}
