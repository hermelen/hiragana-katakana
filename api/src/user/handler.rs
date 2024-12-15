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
                    "INSERT INTO auth_user (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id",
                    &[&user.username, &user.email, &user.password, &user.is_admin],
                )
                .await
            {
                Ok(row) => {
                    let id: Uuid = row.get(0);
                    match client
                        .query_one("SELECT * FROM auth_user WHERE id = $1", &[&id])
                        .await
                    {
                        Ok(row) => {
                            let user: User = new_from_row(row).await;
                            (OK_RESPONSE.to_string(), serde_json::to_string(&user).unwrap())
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

pub(crate) async fn handle_get_user_request(request: &str) -> (String, String) {
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
                .query_one("SELECT * FROM auth_user WHERE id = $1", &[&id])
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
            for row in client.query("SELECT * FROM auth_user", &[]).await.unwrap() {
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

pub(crate) async fn handle_put_user_request(request: &str) -> (String, String) {
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
                    "UPDATE auth_user SET username = $1, email = $2, password = $3, is_admin = $4 WHERE id = $5",
                    &[&user.username, &user.email, &user.password, &user.is_admin, &id],
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

pub(crate) async fn handle_delete_user_request(request: &str) -> (String, String) {
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
                .execute("DELETE FROM auth_user WHERE id = $1", &[&id])
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

// pub async fn me(auth_user: AuthUser) -> Result<Json<AuthUser>> {
//     Ok(Json(auth_user))
// }
//
// pub async fn get_users(
//     Extension(db): Extension<PgPool>,
//     _: AuthUser,
// ) -> Result<Json<Vec<AuthUser>>> {
//     let users = query_as!(AuthUser, r#"SELECT id, username, email FROM "user""#)
//         .fetch_all(&db)
//         .await?;
//     Ok(Json(users))
// }
//
// pub async fn login(
//     Extension(db): Extension<PgPool>,
//     Extension(config): Extension<Config>,
//     Json(credentials): Json<Credentials>,
// ) -> Result<Json<AuthResponse>> {
//     query_as!(
//         User,
//         r#"SELECT * FROM "user" WHERE username = $1 OR email = $1"#,
//         credentials.username_or_email.trim().to_ascii_lowercase()
//     )
//         .fetch_optional(&db)
//         .await?
//         .ok_or_else(|| AppError::Unauthorized)
//         .and_then(|u| verify_password(u, &credentials.password))
//         .and_then(|u| {
//             let id = u.id.expect("User id is missing");
//             let username = u.username;
//             generate_token(&config, id, username, u.email)
//         })
//         .map(|token| Json(AuthResponse { token }))
// }
//
// pub async fn reset(
//     Extension(db): Extension<PgPool>,
//     Extension(config): Extension<Config>,
//     Extension(cache): Extension<UserPendingQueryCache>,
//     Json(q): Json<ResetQuery>,
// ) -> Result<Json<ResetResponse>> {
//     let response = match q {
//         ResetQuery::Ask { email } => ask_for_reset(&db, &config, &cache, email).await?,
//         ResetQuery::Reset { token, password } => {
//             reset_password(&db, &config, &cache, token, password).await?
//         }
//     };
//     Ok(Json(response))
// }
//
// pub async fn register(
//     Extension(db): Extension<PgPool>,
//     Extension(config): Extension<Config>,
//     Extension(cache): Extension<UserPendingQueryCache>,
//     Json(q): Json<RegisterQuery>,
// ) -> Result<()> {
//     let username = q.username.trim().to_ascii_lowercase();
//     let email = q.email.trim().to_ascii_lowercase();
//     if email.is_empty() || username.is_empty() || q.password.is_empty() {
//         return Err(AppError::BadRequest);
//     }
//
//     let count = query!(
//         r#"
//             SELECT count(*) FROM "user" WHERE username = $1 OR email = $2
//         "#,
//         username,
//         email
//     )
//         .fetch_one(&db)
//         .await?
//         .count
//         .unwrap_or(0);
//
//     if count > 0 {
//         return Err(AppError::Conflict("Username already exists".to_string()));
//     }
//
//     let pending_invite = generate_email_token(&config, &email)?;
//     cache.insert(
//         email.clone(),
//         PendingQuery::Invite(pending_invite.clone(), q.clone()),
//     );
//
//     send_invitation_mail(&config, &email, &pending_invite).await?;
//
//     Ok(())
// }
//
// pub async fn confirm(
//     Extension(db): Extension<PgPool>,
//     Extension(config): Extension<Config>,
//     Extension(cache): Extension<UserPendingQueryCache>,
//     Path(token): Path<String>,
// ) -> Result<Json<AuthResponse>> {
//     let pending_invite =
//         decode::<EmailToken>(&token, &config.auth_keys.decoding, &Validation::default())
//             .map_err(|_| AppError::Unauthorized)?;
//     let pending_query = cache
//         .get(&pending_invite.claims.email)
//         .ok_or_else(|| AppError::Unauthorized)?;
//
//     match pending_query {
//         PendingQuery::Invite(invite_token, query) => {
//             if token != invite_token {
//                 return Err(AppError::Unauthorized);
//             }
//             let id = new_uuid();
//             let salt = SaltString::generate(&mut OsRng);
//             let password = hash_password(&query.password, &salt)?;
//             query!(
//                 r#"
//                     INSERT INTO "user" (id, username, email, password)
//                     VALUES ($1, $2, $3, $4)
//                 "#,
//                 id,
//                 query.username,
//                 query.email,
//                 password.to_string()
//             )
//                 .execute(&db)
//                 .await?;
//
//             generate_token(&config, id, query.username, query.email)
//                 .map(|token| Json(AuthResponse { token }))
//         }
//         _ => Err(AppError::Unauthorized),
//     }
// }

fn get_user_request_body(request: &str) -> Result<User, serde_json::Error> {
    serde_json::from_str(request.split("\r\n\r\n").last().unwrap_or_default())
}
