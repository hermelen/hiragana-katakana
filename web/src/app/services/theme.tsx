import { SyllabaryRecord } from "@/app/lib/syllabaryRecord";
import { finalSyllabaryRecord } from "@/app/lib/finalSyllabaryRecords";
import { additionalSyllabaryRecord } from "@/app/lib/additionalSyllabaryRecords";
import { replaceCharacterRecord } from "@/app/lib/replaceCharacterRecord";

export function getJapanese(
  syllabaryRecord: SyllabaryRecord,
  matchText: [string[], string[]],
  inputText: string,
  matchLength: number,
  force: boolean,
): [[string[], string[]], string] {
  if (inputText.length === 0) {
    return [matchText, ""];
  }
  let processText = inputText.slice();
  if (matchLength === 3) {
    if (processText.length >= matchLength) {
      const [rest, translation] = tryParse(
        syllabaryRecord,
        processText,
        3,
        force,
      );
      const [hiraganaSyllabary, katakanaSyllabary] = translation;
      if (hiraganaSyllabary && katakanaSyllabary) {
        matchText[0].push(hiraganaSyllabary);
        matchText[1].push(katakanaSyllabary);
        if (rest !== "") {
          const length = rest.length < 4 ? rest.length : 3;
          return getJapanese(syllabaryRecord, matchText, rest, length, force);
        } else {
          return [matchText, rest];
        }
      }
    }
    return getJapanese(syllabaryRecord, matchText, inputText, 2, force);
  } else if (matchLength === 2) {
    if (processText.length >= matchLength) {
      const [rest, translation] = tryParse(
        syllabaryRecord,
        processText,
        2,
        force,
      );
      const [hiraganaSyllabary, katakanaSyllabary] = translation;
      if (hiraganaSyllabary && katakanaSyllabary) {
        matchText[0].push(hiraganaSyllabary);
        matchText[1].push(katakanaSyllabary);
        if (rest !== "") {
          const length = rest.length < 4 ? rest.length : 3;
          return getJapanese(syllabaryRecord, matchText, rest, length, force);
        } else {
          return [matchText, rest];
        }
      }
    }
    return getJapanese(syllabaryRecord, matchText, inputText, 1, force);
  } else if (matchLength === 1) {
    if (processText.length >= matchLength) {
      const [rest, translation] = tryParse(
        syllabaryRecord,
        processText,
        1,
        force,
      );
      const [hiraganaSyllabary, katakanaSyllabary] = translation;
      if (hiraganaSyllabary !== "" && katakanaSyllabary !== "") {
        matchText[0].push(hiraganaSyllabary);
        matchText[1].push(katakanaSyllabary);
        if (rest !== "") {
          const length = rest.length < 4 ? rest.length : 3;
          return getJapanese(syllabaryRecord, matchText, rest, length, force);
        }
      }
    }
  }
  return [matchText, ""];
}

function tryParse(
  syllabaryRecord: SyllabaryRecord,
  inputText: string,
  length: number,
  force: boolean,
): [string, [string, string]] {
  const partialText = inputText.slice(0, length);
  const finalSyllabary = force ? finalSyllabaryRecord : {};
  const syllabaryRecordEnriched: SyllabaryRecord = {
    ...syllabaryRecord,
    ...additionalSyllabaryRecord,
    ...finalSyllabary,
  };
  const matchText = syllabaryRecordEnriched[partialText];
  if (matchText) {
    const rest = inputText.slice(length);
    return [rest, matchText];
  }
  return [inputText, ["", ""]];
}

export function getPhonetic(value: string) {
  for (const key in replaceCharacterRecord) {
    if (replaceCharacterRecord.hasOwnProperty(key)) {
      const replacement = replaceCharacterRecord[key];
      value = value.replace(new RegExp(key, "g"), replacement);
    }
  }
  return value;
}

export function getRoman(
  syllabaryRecord: SyllabaryRecord,
  hiraganaArray: string[],
) {
  const firstJapaneseAsKey: Record<string, string> = {};

  for (const [roman, japaneseArray] of Object.entries(syllabaryRecord)) {
    const firstJapaneseChar = japaneseArray[0];
    firstJapaneseAsKey[firstJapaneseChar] = roman;
  }

  const romanArray: string[] = [];
  for (const hiragana of hiraganaArray) {
    romanArray.push(firstJapaneseAsKey[hiragana]);
  }

  return romanArray.join("").replace(/u/g, "ou").replace(/e/g, "é");
}

export function isNotAlphabetic(value: string): boolean {
  return !/^[A-Za-z]+$/.test(value);
}
