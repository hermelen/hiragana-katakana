use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::word::handler::{
    delete_word, get_words, get_word,
    create_word, update_word,
};


mod handler;
pub mod model;
mod service;

pub fn word_router() -> Router {
    Router::new()
        .route("/api/word", post(create_word))
        .route("/api/word/", get(get_word))
        .route("/api/word", get(get_words))
        .route("/api/word/", put(update_word))
        .route("/api/word/", delete(delete_word))
}