use std::net::SocketAddr;
use crate::syllable::syllable_router;
use crate::user::user_router;
use crate::word::word_router;
use anyhow::Result;
use axum::{http, Extension, Router};
use axum::http::Method;
use sqlx::PgPool;
use tower_http::trace;
use tower_http::trace::TraceLayer;
use tracing::Level;
use tower_http::cors::{Any, CorsLayer};
use crate::config::Config;

pub async fn handle_client(db: PgPool, config: Config) -> Result<()> {

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
        .layer(Extension(config));

    let addr = SocketAddr::from(([0, 0, 0, 0], 5000));
    tracing::info!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    tokio::signal::ctrl_c()
        .await
        .expect("expect tokio signal ctrl-c");
}
