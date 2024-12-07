use crate::word::handler::{
    handle_delete_words_request, handle_get_all_words_request, handle_get_words_request,
    handle_post_words_request, handle_put_words_request,
};

mod handler;
pub(crate) mod model;

pub async fn word_router(request: &str) -> Option<(String, String)> {
    match request {
        r if r.starts_with("POST /api/word") => Some(handle_post_words_request(r).await),
        r if r.starts_with("GET /api/word/") => Some(handle_get_words_request(r).await),
        r if r.starts_with("GET /api/word") => Some(handle_get_all_words_request(r).await),
        r if r.starts_with("PUT /api/word/") => Some(handle_put_words_request(r).await),
        r if r.starts_with("DELETE /api/word/") => Some(handle_delete_words_request(r).await),
        _ => None,
    }
}
