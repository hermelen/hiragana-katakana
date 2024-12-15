use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::syllable::handler::{
    handle_delete_syllable_request, handle_get_all_syllables_request, handle_get_syllable_request,
    handle_post_syllables_request, handle_put_syllable_request,
};

mod handler;
pub mod model;

pub async fn syllable_router() -> Router {
    Router::new()
        .route("POST /api/syllable", post(handle_post_syllables_request))
        .route("GET /api/syllable/", get(handle_get_syllable_request))
        .route("GET /api/syllable", get(handle_get_all_syllables_request))
        .route("PUT /api/syllable/", put(handle_put_syllable_request))
        .route("DELETE /api/syllable/", delete(handle_delete_syllable_request))
}
