use tokio_postgres::Row;

pub fn get_id(request: &str) -> &str {
    request
        .split("/")
        .nth(4)
        .unwrap_or_default()
        .split_whitespace()
        .next()
        .unwrap_or_default()
}

pub async fn new_from_row<T: FromRow>(row: Row) -> T {
    T::from_row(row)
}

pub trait FromRow {
    fn from_row(row: Row) -> Self;
}

impl FromRow for crate::syllable::model::Syllable {
    fn from_row(row: Row) -> Self {
        crate::syllable::model::Syllable {
            id: Some(row.get(0)),
            roman: row.get(1),
            hiragana: row.get(2),
            katakana: row.get(3),
            kanji: row.get::<_, Option<String>>(4),
        }
    }
}

impl FromRow for crate::user::model::User {
    fn from_row(row: Row) -> Self {
        crate::user::model::User {
            id: Some(row.get(0)),
            username: row.get(1),
            email: row.get(2),
            password: row.get(3),
        }
    }
}

impl FromRow for crate::word::model::Word {
    fn from_row(row: Row) -> Self {
        crate::word::model::Word {
            id: Some(row.get(0)),
            roman: row.get(1),
            hiragana: row.get::<_, Option<String>>(2),
            katakana: row.get::<_, Option<String>>(3),
            kanji: row.get::<_, Option<String>>(4),
        }
    }
}
