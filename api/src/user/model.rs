use serde_derive::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct User {
    pub(crate) id: Option<Uuid>,
    pub(crate) username: String,
    pub(crate) email: String,
    pub(crate) password: String,
    pub(crate) is_admin: bool,
}
