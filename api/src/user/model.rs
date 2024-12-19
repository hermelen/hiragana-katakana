use jsonwebtoken::{DecodingKey, EncodingKey};
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

#[derive(Clone)]
pub struct Keys {
    pub encoding: EncodingKey,
    pub decoding: DecodingKey,
}

#[derive(Serialize, Deserialize)]
pub struct User {
    pub(crate) id: Option<Uuid>,
    pub(crate) username: String,
    pub(crate) email: String,
    pub(crate) password: String,
    pub(crate) is_admin: bool,
}

impl Keys {
    pub fn new(secret: &[u8]) -> Self {
        Self {
            encoding: EncodingKey::from_secret(secret),
            decoding: DecodingKey::from_secret(secret),
        }
    }
}
