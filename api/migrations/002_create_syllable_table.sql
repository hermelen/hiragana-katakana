CREATE TABLE IF NOT EXISTS syllable (
    id uuid DEFAULT gen_random_uuid(),
    roman VARCHAR NOT NULL,
    hiragana VARCHAR NOT NULL,
    katakana VARCHAR NOT NULL,
    kanji VARCHAR NULL
);