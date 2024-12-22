use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::user::handler::{
    delete_user, get_users, get_user,
    create_user, update_user,
};


mod handler;
pub mod model;
mod service;

pub fn user_router() -> Router {
    Router::new()
        .route("/api/user", post(create_user))
        .route("/api/user/", get(get_user))
        .route("/api/user", get(get_users))
        .route("/api/user/", put(update_user))
        .route("/api/user/", delete(delete_user))
        // .route("/api/user/register", post(register))
        // .route("/api/user/confirm/:token", post(confirm))
        // .route("/api/user/reset", post(reset))
        // .route("/api/user/login", post(login))
        // .route("/api/user", get(get_users))
        // .route("/api/user/me", get(me))
}

