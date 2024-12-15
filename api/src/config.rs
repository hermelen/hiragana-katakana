use crate::user::model::Keys;
use std::env::var;

#[derive(Clone)]
pub struct B2Config {
    pub id: String,
    pub key: String,
    pub bucket_id: String,
}

#[derive(Clone)]
pub struct Config {
    pub brevo_api_key: String,
    pub auth_keys: Keys,
    pub b2: B2Config,
}

impl Config {
    pub fn load() -> Config {
        Config {
            brevo_api_key: var("BREVO_API_KEY").expect("Miss BREVO_API_KEY"),
            auth_keys: Keys::new(var("JWT_SECRET").expect("Miss JWT_SECRET").as_bytes()),
            b2: B2Config {
                id: var("B2_ID").expect("Miss B2_ID"),
                key: var("B2_KEY").expect("Miss B2_KEY"),
                bucket_id: var("B2_BUCKET_ID").expect("Miss B2_BUCKET_ID"),
            },
        }
    }
}
