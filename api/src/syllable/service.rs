use sqlx::{query, PgPool};
use uuid::Uuid;
use crate::db::new_uuid;
use crate::error::{AppError, Result};
use crate::syllable::model::{Syllable};

pub async fn create_syllable(db: &PgPool, syllable: Syllable) -> Result<Syllable> {
    let id = new_uuid();
    query!(
        r#"
            INSERT INTO syllable (id, roman, hiragana, katakana, kanji) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
        id,
        syllable.roman,
        syllable.hiragana,
        syllable.katakana,
        syllable.kanji
    )
        .fetch_one(db)
        .await?;

    get_syllable(db, id).await
}

pub async fn update_syllable(db: &PgPool, syllable: Syllable) -> Result<Syllable> {
    let mut tx = db.begin().await?;
    query!(
        r#"
            UPDATE syllable
            SET roman = $2,
                hiragana = $3,
                katakana = $4,
                kanji = $5
            WHERE id = $1
        "#,
        syllable.id,
        syllable.roman,
        syllable.hiragana,
        syllable.katakana,
        syllable.kanji,
    )
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;

    get_syllable(db, syllable.id.unwrap()).await
}

pub async fn get_syllable(db: &PgPool, id: Uuid) -> Result<Syllable> {
    let row = query!(
        "SELECT * FROM syllable WHERE id = $1",
        id,
    )
        .fetch_optional(db)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

    Ok(Syllable {
        id: Some(row.id).unwrap(),
        roman: row.roman,
        hiragana: row.hiragana,
        katakana: row.katakana,
        kanji: Some(row.kanji).unwrap(),
    })
}

pub async fn get_syllables(db: &PgPool) -> Result<Vec<Syllable>> {
    let syllables = query!(
        "SELECT * FROM syllable"
    )
        .fetch_all(db)
        .await?;

    Ok(syllables
        .into_iter()
        .map(|row| Syllable {
            id: Some(row.id).unwrap(),
            roman: row.roman,
            hiragana: row.hiragana,
            katakana: row.katakana,
            kanji: Some(row.kanji).unwrap(),
        })
        .collect())
}

pub async fn delete_syllable(db: &PgPool, id: Uuid) -> Result<()> {
    query!(
        "DELETE FROM syllable WHERE id = $1",
        id
    )
        .execute(db)
        .await?;
    Ok(())
}