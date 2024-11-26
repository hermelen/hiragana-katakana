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
  checkedList: boolean[],
): [string, string][] {
  return wordList
    .map((w) => {
      const typeList: CharacterType[] = [];
      const translationList: [string, string][] = [];
      for (let i = 0; i < checkedList.length; i++) {
        if (checkedList[i]) {
          typeList.push(i);
        }
      }
      if (typeList.includes(CharacterType.hiragana) && w.hiragana) {
        translationList.push([w.roman, w.hiragana]);
      }
      if (typeList.includes(CharacterType.katakana) && w.katakana) {
        translationList.push([w.roman, w.katakana]);
      }
      if (typeList.includes(CharacterType.kanji) && w.kanji) {
        translationList.push([w.roman, w.kanji]);
      }
      return translationList.flatMap((x) => x);
    })
    .filter((entry): entry is [string, string] => entry[1] !== undefined);
}
