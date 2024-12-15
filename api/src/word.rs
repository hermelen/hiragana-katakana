use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::word::handler::{
    handle_delete_word_request, handle_get_all_words_request, handle_get_word_request,
    handle_post_words_request, handle_put_word_request,
};

mod handler;
pub(crate) mod model;

pub async fn word_router() -> Router {
    Router::new()
        .route("/api/word", post(handle_post_words_request))
        .route("/api/word/", get(handle_get_word_request))
        .route("/api/word", get(handle_get_all_words_request))
        .route("/api/word/", put(handle_put_word_request))
        .route("/api/word/", delete(handle_delete_word_request))
}
