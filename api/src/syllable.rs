use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::syllable::handler::{
    delete_syllable, get_syllables, get_syllable,
    post_syllables, put_syllable,
};

mod handler;
pub mod model;

pub async fn syllable_router() -> Router {
    Router::new()
        .route("POST /api/syllable", post(post_syllables))
        .route("GET /api/syllable/", get(get_syllable))
        .route("GET /api/syllable", get(get_syllables))
        .route("PUT /api/syllable/", put(put_syllable))
        .route("DELETE /api/syllable/", delete(delete_syllable))
}
