use std::net::SocketAddr;
use crate::service::constant::{NOT_FOUND, OK_RESPONSE};
use crate::syllable::syllable_router;
use crate::user::user_router;
use crate::word::word_router;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tokio::net::{TcpListener, TcpStream};
use anyhow::Result;
use axum::{http, Extension, Router};
use axum::http::Method;
use moka::sync::Cache;
use tokio_postgres::Config;
use tracing::debug;
use crate::user::model::UserPendingQueryCache;
use tower_http::trace;
use tower_http::trace::TraceLayer;
use tracing::Level;
use tower_http::cors::{Any, CorsLayer};

async fn handle_client() -> Result<()> {
    let cache: UserPendingQueryCache = Cache::new(1000);

    let trace_layer = TraceLayer::new_for_http()
        .make_span_with(trace::DefaultMakeSpan::new().level(Level::INFO))
        .on_response(trace::DefaultOnResponse::new().level(Level::INFO));

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers([
            http::header::AUTHORIZATION,
            http::header::CONTENT_TYPE,
            http::header::CONTENT_LENGTH,
        ])
        .allow_origin(Any);

    let app = Router::new()
        .merge(user_router())
        .merge(syllable_router())
        .merge(word_router())
        .layer(trace_layer)
        .layer(cors)
        .layer(Extension(db))
        .layer(Extension(cache))
        .layer(Extension(config));

    let addr = SocketAddr::from(([0, 0, 0, 0], 5000));
    tracing::info!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}


// pub async fn handle_client() -> Result<()> {
//     let listener = TcpListener::bind("0.0.0.0:8000")
//         .await
//         .map_err(|e| format!("Failed to bind to port: {}", e))?;
//     debug!("Server listening on port 8000");
//
//     loop {
//         match listener.accept().await {
//             Ok((stream, _)) => {
//                 tokio::spawn(async move {
//                     if let Err(e) = handler(stream).await {
//                         debug!("Error handling client: {}", e);
//                     }
//                 });
//             }
//             Err(e) => {
//                 debug!("Unable to accept connection: {}", e);
//             }
//         }
//     }
// }

// async fn handler(mut stream: TcpStream) -> tokio::io::Result<()> {
//     let mut buffer = [0; 1024];
//     let mut request = String::new();
//
//     let size = stream.read(&mut buffer).await?;
//     if size == 0 {
//         return Ok(());
//     }
//
//     request.push_str(String::from_utf8_lossy(&buffer[..size]).as_ref());
//
//     let (status_line, content) = if request.starts_with("OPTIONS") {
//         (OK_RESPONSE.to_string(), "".to_string())
//     } else if let Some(result) = syllable_router(&request).await {
//         result
//     } else if let Some(result) = word_router(&request).await {
//         result
//     } else if let Some(result) = user_router(&request).await {
//         result
//     } else {
//         (NOT_FOUND.to_string(), String::from("404 Not Found"))
//     };
//
//     stream
//         .write_all(format!("{}{}", status_line, content).as_bytes())
//         .await?;
//     stream.shutdown().await?;
//     Ok(())
// }
