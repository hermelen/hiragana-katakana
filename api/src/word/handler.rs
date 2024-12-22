use axum::extract::{Path};
use axum::{Extension, Json};
use sqlx::{PgPool};
use uuid::Uuid;

use crate::error::Result;
use crate::word::model::Word;
use crate::word::service;

pub async fn create_word(
    Extension(db): Extension<PgPool>,
    Json(word): Json<Word>,
) -> Result<Json<Word>> {
    let word = service::create_word(&db, word).await?;
    Ok(Json(word))
}

pub async fn update_word(
    Extension(db): Extension<PgPool>,
    Json(word): Json<Word>,
) -> Result<Json<Word>> {
    let word = service::update_word(&db, word).await?;
    Ok(Json(word))
}

pub async fn get_word(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Word>> {
    let word = service::get_word(&db, id).await?;
    Ok(Json(word))
}

pub async fn get_words(
    Extension(db): Extension<PgPool>,
) -> Result<Json<Vec<Word>>> {
    let words = service::get_words(&db).await?;
    Ok(Json(words))
}

pub async fn delete_word(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<()> {
    service::delete_word(&db, id).await?;
    Ok(())
}
