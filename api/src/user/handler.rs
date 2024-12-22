use axum::extract::{Path};
use axum::{Extension, Json};
use sqlx::{PgPool};
use uuid::Uuid;

use crate::error::Result;
use crate::user::model::User;
use crate::user::service;

pub async fn create_user(
    Extension(db): Extension<PgPool>,
    Json(user): Json<User>,
) -> Result<Json<User>> {
    let user = service::create_user(&db, user).await?;
    Ok(Json(user))
}

pub async fn update_user(
    Extension(db): Extension<PgPool>,
    Json(user): Json<User>,
) -> Result<Json<User>> {
    let user = service::update_user(&db, user).await?;
    Ok(Json(user))
}

pub async fn get_user(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<User>> {
    let user = service::get_user(&db, id).await?;
    Ok(Json(user))
}

pub async fn get_users(
    Extension(db): Extension<PgPool>,
) -> Result<Json<Vec<User>>> {
    let users = service::get_users(&db).await?;
    Ok(Json(users))
}

pub async fn delete_user(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<()> {
    service::delete_user(&db, id).await?;
    Ok(())
}
