import { UUID } from "node:crypto";
import { CharacterType } from "@/app/lib/syllabaryRecord";

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

export function formatTypedWordList(
  wordList: Word[],
  type: CharacterType,
): [string, string][] {
  return wordList
    .map((w) => {
      let translation: string | undefined;
      switch (type) {
        case CharacterType.hiragana:
          translation = w.hiragana;
          break;
        case CharacterType.katakana:
          translation = w.katakana;
          break;
        case CharacterType.kanji:
          translation = w.kanji;
          break;
      }
      if (translation === undefined) {
        return null;
      }
      return [w.roman, translation];
    })
    .filter((entry): entry is [string, string] => entry !== null);
}
