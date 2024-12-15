CREATE TABLE IF NOT EXISTS word (
    id uuid DEFAULT gen_random_uuid(),
    roman VARCHAR NOT NULL,
    hiragana VARCHAR NULL,
    katakana VARCHAR NULL,
    kanji VARCHAR NULL
);