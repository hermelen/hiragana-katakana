use std::env::var;

#[derive(Clone)]
pub struct Config {
    pub database_url: String
}

impl Config {
    pub fn load() -> Config {
        Config {
            database_url: var("DATABASE_URL").expect("DATABASE_URL must be set"),
        }
    }
}
