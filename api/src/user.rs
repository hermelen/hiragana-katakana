use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::user::handler::{
    delete_user, get_users, get_user,
    post_users, put_user,
};


mod handler;
pub mod model;

pub fn user_router() -> Router {
    Router::new()
        .route("/api/user", post(post_users))
        .route("/api/user/", get(get_user))
        .route("/api/user", get(get_users))
        .route("/api/user/", put(put_user))
        .route("/api/user/", delete(delete_user))
        // .route("/api/user/register", post(register))
        // .route("/api/user/confirm/:token", post(confirm))
        // .route("/api/user/reset", post(reset))
        // .route("/api/user/login", post(login))
        // .route("/api/user", get(get_users))
        // .route("/api/user/me", get(me))
}

