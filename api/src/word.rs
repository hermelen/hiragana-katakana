use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::word::handler::{
    delete_word, get_words, get_word,
    post_words, put_word,
};

mod handler;
pub(crate) mod model;

pub async fn word_router() -> Router {
    Router::new()
        .route("/api/word", post(post_words))
        .route("/api/word/", get(get_word))
        .route("/api/word", get(get_words))
        .route("/api/word/", put(put_word))
        .route("/api/word/", delete(delete_word))
}
