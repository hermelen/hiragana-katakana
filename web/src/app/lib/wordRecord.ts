import { UUID } from "node:crypto";

export interface Word {
  id?: UUID;
  roman: string;
  hiragana?: string;
  katakana?: string;
  kanji?: string;
}

export function formatWordList(wordList: Word[]): [string, string][] {
  return wordList.map((w) => {
    const translation = w.hiragana ?? w.katakana ?? w.kanji ?? "";
    return [w.roman, translation];
  });
}
