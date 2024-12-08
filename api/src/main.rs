use crate::db::init_db;
use crate::sever::handle_client;

mod db;
mod service;
mod sever;
mod syllable;
mod user;
mod word;

#[tokio::main]
async fn main() {
    match init_db().await {
        Ok(()) => eprintln!("Success setting up the database"),
        Err(e) => eprintln!("Error setting up the database: {}", e),
    }

    match handle_client().await {
        Ok(()) => println!("Server started"),
        Err(e) => eprintln!("Error starting the server: {}", e),
    }
}
