use crate::syllable::handler::{
    handle_delete_syllables_request, handle_get_all_syllables_request,
    handle_get_syllables_request, handle_post_syllables_request, handle_put_syllables_request,
};

mod handler;
pub(crate) mod model;

pub async fn syllable_router(request: &str) -> Option<(String, String)> {
    match request {
        r if r.starts_with("POST /api/rust/syllable") => {
            Some(handle_post_syllables_request(r).await)
        }
        r if r.starts_with("GET /api/rust/syllable/") => {
            Some(handle_get_syllables_request(r).await)
        }
        r if r.starts_with("GET /api/rust/syllable") => {
            Some(handle_get_all_syllables_request(r).await)
        }
        r if r.starts_with("PUT /api/rust/syllable/") => {
            Some(handle_put_syllables_request(r).await)
        }
        r if r.starts_with("DELETE /api/rust/syllable/") => {
            Some(handle_delete_syllables_request(r).await)
        }
        _ => None,
    }
}
