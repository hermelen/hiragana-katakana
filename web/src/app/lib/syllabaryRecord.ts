import { Syllable } from "@/api/syllable";

export type SyllabaryRecord = Record<string, [string, string]>;

export enum CharacterType {
  hiragana,
  katakana,
  kanji,
}

export function getSyllableListToRecord(
  syllableList: Syllable[],
): SyllabaryRecord {
  if (syllableList.length === 0) {
    return {};
  }

  return syllableList.reduce<SyllabaryRecord>((record, syllable) => {
    record[syllable.roman] = [syllable.hiragana, syllable.katakana];
    return record;
  }, {} as SyllabaryRecord);
}
