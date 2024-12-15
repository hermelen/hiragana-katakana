use serde_derive::{Deserialize, Serialize};
use uuid::Uuid;
use moka::sync::Cache;

pub type UserPendingQueryCache = Cache<String, PendingQuery>;

#[derive(Debug, Clone)]
pub enum PendingQuery {
    Invite(String, RegisterQuery),
    Reset(String),
}

#[derive(Debug, Deserialize, Clone)]
pub struct RegisterQuery {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub(crate) id: Option<Uuid>,
    pub(crate) username: String,
    pub(crate) email: String,
    pub(crate) password: String,
    pub(crate) is_admin: bool,
}
