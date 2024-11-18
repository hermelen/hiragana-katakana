import { Syllable } from "@/app/syllabary-table/page";

export type SyllabaryRecord = Record<string, [string, string]>;

export function getSyllableListToRecord(
  syllableList: Syllable[],
): SyllabaryRecord {
  if (syllableList.length === 0) {
    return;
  }

  return syllableList.reduce((record, syllable) => {
    record[syllable.roman] = [syllable.hiragana, syllable.katakana];
    return record;
  }, {});
}
