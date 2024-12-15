use axum::routing::{delete, get, post, put};
use axum::Router;

use crate::user::handler::{
    handle_delete_user_request, handle_get_all_users_request, handle_get_user_request,
    handle_post_users_request, handle_put_user_request,
};


mod handler;
pub mod model;

pub fn user_router() -> Router {
    Router::new()
        .route("/api/user", post(handle_post_users_request))
        .route("/api/user/", get(handle_get_user_request))
        .route("/api/user", get(handle_get_all_users_request))
        .route("/api/user/", put(handle_put_user_request))
        .route("/api/user/", delete(handle_delete_user_request))
        // .route("/api/user/register", post(register))
        // .route("/api/user/confirm/:token", post(confirm))
        // .route("/api/user/reset", post(reset))
        // .route("/api/user/login", post(login))
        // .route("/api/user", get(get_users))
        // .route("/api/user/me", get(me))
}

