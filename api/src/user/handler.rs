use crate::service::constant::{DB_URL, INTERNAL_ERROR, NOT_FOUND, OK_RESPONSE};
use crate::service::function::{get_id, new_from_row};
use crate::user::model::User;
use tokio_postgres::NoTls;
use uuid::Uuid;

pub(crate) async fn handle_post_users_request(request: &str) -> (String, String) {
    match (
        get_user_request_body(request),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(user), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .query_one(
                    "INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING id",
                    &[&user.username, &user.email, &user.password],
                )
                .await
            {
                Ok(row) => {
                    let id: Uuid = row.get(0);
                    match client
                        .query_one("SELECT * FROM user WHERE id = $1", &[&id])
                        .await
                    {
                        Ok(row) => {
                            let user: User = new_from_row(row).await;
                            (
                                OK_RESPONSE.to_string(),
                                serde_json::to_string(&user).unwrap(),
                            )
                        }
                        Err(_) => (
                            INTERNAL_ERROR.to_string(),
                            "Failed to retrieve created user".to_string(),
                        ),
                    }
                }
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to insert user".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub(crate) async fn handle_get_users_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            match client
                .query_one("SELECT * FROM user WHERE id = $1", &[&id])
                .await
            {
                Ok(row) => {
                    let user: User = new_from_row(row).await;
                    (
                        OK_RESPONSE.to_string(),
                        serde_json::to_string(&user).unwrap(),
                    )
                }
                _ => (NOT_FOUND.to_string(), "User not found".to_string()),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub(crate) async fn handle_get_all_users_request(_request: &str) -> (String, String) {
    match tokio_postgres::connect(DB_URL, NoTls).await {
        Ok((client, connection)) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });
            let mut users = Vec::new();
            for row in client.query("SELECT * FROM user", &[]).await.unwrap() {
                let user: User = new_from_row(row).await;
                users.push(user);
            }
            (
                OK_RESPONSE.to_string(),
                serde_json::to_string(&users).unwrap(),
            )
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub(crate) async fn handle_put_users_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        get_user_request_body(&request),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok(user), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("connection error: {}", e);
                }
            });

            match client
                .execute(
                    "UPDATE user SET username = $1, email = $2, password = $3 WHERE id = $4",
                    &[&user.username, &user.email, &user.password, &id],
                )
                .await
            {
                Ok(_) => (OK_RESPONSE.to_string(), "User updated".to_string()),
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to update user".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

pub(crate) async fn handle_delete_users_request(request: &str) -> (String, String) {
    match (
        get_id(&request).parse::<Uuid>(),
        tokio_postgres::connect(DB_URL, NoTls).await,
    ) {
        (Ok(id), Ok((client, connection))) => {
            tokio::spawn(async move {
                if let Err(e) = connection.await {
                    eprintln!("Connection error: {}", e);
                }
            });

            match client
                .execute("DELETE FROM user WHERE id = $1", &[&id])
                .await
            {
                Ok(rows_affected) => {
                    if rows_affected == 0 {
                        return (NOT_FOUND.to_string(), "Syllable not found".to_string());
                    }

                    (OK_RESPONSE.to_string(), "Syllable deleted".to_string())
                }
                Err(_) => (
                    INTERNAL_ERROR.to_string(),
                    "Failed to delete user".to_string(),
                ),
            }
        }
        _ => (INTERNAL_ERROR.to_string(), "Internal error".to_string()),
    }
}

fn get_user_request_body(request: &str) -> Result<User, serde_json::Error> {
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}
