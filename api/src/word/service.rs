use sqlx::{query, PgPool};
use uuid::Uuid;
use crate::db::new_uuid;
use crate::error::{AppError, Result};
use crate::word::model::{Word};

pub async fn create_word(db: &PgPool, word: Word) -> Result<Word> {
    let id = new_uuid();
    query!(
        r#"
            INSERT INTO word (id, roman, hiragana, katakana, kanji) VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        "#,
        id,
        word.roman,
        word.hiragana,
        word.katakana,
        word.kanji
    )
        .fetch_one(db)
        .await?;

    get_word(db, id).await
}

pub async fn update_word(db: &PgPool, word: Word) -> Result<Word> {
    let mut tx = db.begin().await?;
    query!(
        r#"
            UPDATE word
            SET roman = $2,
                hiragana = $3,
                katakana = $4,
                kanji = $5
            WHERE id = $1
        "#,
        word.id,
        word.roman,
        word.hiragana,
        word.katakana,
        word.kanji,
    )
        .execute(&mut *tx)
        .await?;

    tx.commit().await?;

    get_word(db, word.id.unwrap()).await
}

pub async fn get_word(db: &PgPool, id: Uuid) -> Result<Word> {
    let row = query!(
        "SELECT * FROM word WHERE word.id = $1",
        id,
    )
        .fetch_optional(db)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

    Ok(Word {
        id: Some(row.id).unwrap(),
        roman: row.roman,
        hiragana: Some(row.hiragana).unwrap(),
        katakana: Some(row.katakana).unwrap(),
        kanji: Some(row.kanji).unwrap(),
    })
}

pub async fn get_words(db: &PgPool) -> Result<Vec<Word>> {
    let words = query!(
        "SELECT * FROM word"
    )
        .fetch_all(db)
        .await?;

    Ok(words
        .into_iter()
        .map(|row| Word {
            id: Some(row.id).unwrap(),
            roman: row.roman,
            hiragana: row.hiragana,
            katakana: row.katakana,
            kanji: Some(row.kanji).unwrap(),
        })
        .collect())
}

pub async fn delete_word(db: &PgPool, id: Uuid) -> Result<()> {
    query!(
        "DELETE FROM word WHERE id = $1",
        id
    )
        .execute(db)
        .await?;
    Ok(())
}