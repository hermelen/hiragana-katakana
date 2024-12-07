use serde_derive::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct Word {
    pub(crate) id: Option<Uuid>,
    pub(crate) roman: String,
    pub(crate) hiragana: Option<String>,
    pub(crate) katakana: Option<String>,
    pub(crate) kanji: Option<String>,
}
