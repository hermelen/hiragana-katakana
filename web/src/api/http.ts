import { Syllable } from "@/app/syllabary-table/page";
import { Word } from "@/app/lib/wordRecord";

export async function getSyllableList(
  apiUrl: string,
  backendName: string,
): Promise<Syllable[]> {
  return fetch(`${apiUrl}/api/${backendName}/syllable`, {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error("Error getting data:", err);
      return [];
    });
}

export async function getWordList(
  apiUrl: string,
  backendName: string,
): Promise<Word[]> {
  return fetch(`${apiUrl}/api/${backendName}/word`, {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error("Error getting data:", err);
      return [];
    });
}

export async function postWord(
  apiUrl: string,
  backendName: string,
  newWord: Word,
): Promise<Word> {
  return fetch(`${apiUrl}/api/${backendName}/word`, {
    method: "POST",
    body: JSON.stringify({
      roman: newWord.roman,
      hiragana: newWord.hiragana !== "" ? newWord.hiragana : undefined,
      katakana: newWord.katakana !== "" ? newWord.katakana : undefined,
      kanji: newWord.kanji !== "" ? newWord.kanji : undefined,
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error("Error posting data:", err);
      return;
    });
}
