use serde_derive::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Syllable {
    pub(crate) id: Option<Uuid>,
    pub(crate) roman: String,
    pub(crate) hiragana: String,
    pub(crate) katakana: String,
    pub(crate) kanji: Option<String>,
}
