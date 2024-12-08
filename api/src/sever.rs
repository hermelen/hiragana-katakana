use crate::service::constant::{NOT_FOUND, OK_RESPONSE};
use crate::syllable::syllable_router;
use crate::user::user_router;
use crate::word::word_router;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};

pub async fn handle_client() -> Result<(), Box<dyn std::error::Error>> {
    let listener = TcpListener::bind("0.0.0.0:8000")
        .await
        .map_err(|e| format!("Failed to bind to port: {}", e))?;
    println!("Server listening on port 8000");

    loop {
        match listener.accept().await {
            Ok((stream, _)) => {
                tokio::spawn(async move {
                    if let Err(e) = handler(stream).await {
                        eprintln!("Error handling client: {}", e);
                    }
                });
            }
            Err(e) => {
                eprintln!("Unable to accept connection: {}", e);
            }
        }
    }
}

async fn handler(mut stream: TcpStream) -> tokio::io::Result<()> {
    let mut buffer = [0; 1024];
    let mut request = String::new();

    let size = stream.read(&mut buffer).await?;
    if size == 0 {
        return Ok(());
    }

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
        .await?;
    stream.shutdown().await?;
    Ok(())
}
