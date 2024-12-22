use sqlx::{query, PgPool};
use uuid::Uuid;
use crate::db::new_uuid;
use crate::error::{AppError, Result};
use crate::user::model::{User};

pub async fn create_user(db: &PgPool, user: User) -> Result<User> {
    let id = new_uuid();
    query!(
        r#"
            INSERT INTO auth_user (id, username, email, password, is_admin) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
        id,
        user.username,
        user.email,
        user.password,
        user.is_admin,
    )
        .fetch_one(db)
        .await?;

    get_user(db, id).await
}

pub async fn update_user(db: &PgPool, user: User) -> Result<User> {
    let mut tx = db.begin().await?;
    query!(
        r#"
            UPDATE auth_user
            SET username = $2,
                email= $3,
                password = $4,
                is_admin = $5
            WHERE id = $1
        "#,
        user.id,
        user.username,
        user.email,
        user.password,
        user.is_admin,
    )
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;

    get_user(db, user.id.unwrap()).await
}

pub async fn get_user(db: &PgPool, id: Uuid) -> Result<User> {
    let row = query!(
        "SELECT * FROM auth_user WHERE id = $1",
        id,
    )
        .fetch_optional(db)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

    Ok(User {
        id: Some(row.id).unwrap(),
        username: row.username,
        email: row.email,
        password: row.password,
        is_admin: row.is_admin,
    })
}

pub async fn get_users(db: &PgPool) -> Result<Vec<User>> {
    let users = query!(
        "SELECT * FROM auth_user"
    )
        .fetch_all(db)
        .await?;

    Ok(users
        .into_iter()
        .map(|row| User {
            id: Some(row.id).unwrap(),
            username: row.username,
            email: row.email,
            password: row.password,
            is_admin: Some(row.is_admin).unwrap(),
        })
        .collect())
}

pub async fn delete_user(db: &PgPool, id: Uuid) -> Result<()> {
    query!("DELETE FROM auth_user WHERE id = $1", id)
        .execute(db)
        .await?;
    Ok(())
}