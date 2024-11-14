import {Syllable} from "@/app/syllabary-table/page";

export async function getSyllableList(apiUrl: string, backendName: string): Promise<Syllable[]> {
  return fetch(`${apiUrl}/api/${backendName}/syllable`)
    .then((response) => response.json())
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.error("Error getting data:", err);
      return [];
    });
}