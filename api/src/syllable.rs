use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::syllable::handler::{
    delete_syllable, get_syllables, get_syllable,
    create_syllable, update_syllable,
};


mod handler;
pub mod model;
mod service;

pub fn syllable_router() -> Router {
    Router::new()
        .route("/api/syllable", post(create_syllable))
        .route("/api/syllable/", get(get_syllable))
        .route("/api/syllable", get(get_syllables))
        .route("/api/syllable/", put(update_syllable))
        .route("/api/syllable/", delete(delete_syllable))
}

