use axum::extract::{Path};
use axum::{Extension, Json};
use sqlx::{PgPool};
use uuid::Uuid;

use crate::error::Result;
use crate::syllable::model::Syllable;
use crate::syllable::service;

pub async fn create_syllable(
    Extension(db): Extension<PgPool>,
    Json(syllable): Json<Syllable>,
) -> Result<Json<Syllable>> {
    let syllable = service::create_syllable(&db, syllable).await?;
    Ok(Json(syllable))
}

pub async fn update_syllable(
    Extension(db): Extension<PgPool>,
    Json(syllable): Json<Syllable>,
) -> Result<Json<Syllable>> {
    let syllable = service::update_syllable(&db, syllable).await?;
    Ok(Json(syllable))
}

pub async fn get_syllable(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<Json<Syllable>> {
    let syllable = service::get_syllable(&db, id).await?;
    Ok(Json(syllable))
}

pub async fn get_syllables(
    Extension(db): Extension<PgPool>,
) -> Result<Json<Vec<Syllable>>> {
    let syllables = service::get_syllables(&db).await?;
    Ok(Json(syllables))
}

pub async fn delete_syllable(
    Extension(db): Extension<PgPool>,
    Path(id): Path<Uuid>,
) -> Result<()> {
    service::delete_syllable(&db, id).await?;
    Ok(())
}
