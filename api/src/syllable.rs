use crate::syllable::handler::{
    handle_delete_syllable_request, handle_get_all_syllables_request, handle_get_syllable_request,
    handle_post_syllables_request, handle_put_syllable_request,
};

mod handler;
pub(crate) mod model;

pub async fn syllable_router(request: &str) -> Option<(String, String)> {
    match request {
        r if r.starts_with("POST /api/syllable") => Some(handle_post_syllables_request(r).await),
        r if r.starts_with("GET /api/syllable/") => Some(handle_get_syllable_request(r).await),
        r if r.starts_with("GET /api/syllable") => Some(handle_get_all_syllables_request(r).await),
        r if r.starts_with("PUT /api/syllable/") => Some(handle_put_syllable_request(r).await),
        r if r.starts_with("DELETE /api/syllable/") => {
            Some(handle_delete_syllable_request(r).await)
        }
        _ => None,
    }
}
