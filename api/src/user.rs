use crate::user::handler::{
    handle_delete_users_request, handle_get_all_users_request, handle_get_users_request,
    handle_post_users_request, handle_put_users_request,
};
mod handler;
pub(crate) mod model;

pub async fn user_router(request: &str) -> Option<(String, String)> {
    match request {
        r if r.starts_with("POST /api/user") => Some(handle_post_users_request(r).await),
        r if r.starts_with("GET /api/user/") => Some(handle_get_users_request(r).await),
        r if r.starts_with("GET /api/user") => Some(handle_get_all_users_request(r).await),
        r if r.starts_with("PUT /api/user/") => Some(handle_put_users_request(r).await),
        r if r.starts_with("DELETE /api/user/") => Some(handle_delete_users_request(r).await),
        _ => None,
    }
}
