import { HttpClient } from "@/api/http";
import { UUID } from "node:crypto";

export interface Syllable {
  id: UUID;
  roman: string;
  hiragana: string;
  katakana: string;
  kanji?: string;
}

export class SyllableServiceClient {
  constructor(private http: HttpClient) {}

  async save(apiUrl: string, program: Syllable) {
    return this.http.postAs<string>(`${apiUrl}/api/syllable`, {
      body: program,
    });
  }

  async list(apiUrl: string) {
    return this.http.get<Syllable[]>(`${apiUrl}/api/syllable`);
  }

  async get(apiUrl: string, id: string) {
    return this.http.get<Syllable[]>(`${apiUrl}/api/syllable/${id}`);
  }

  async delete(apiUrl: string, id: string) {
    return this.http.del(`${apiUrl}/api/syllable/${id}`);
  }
}
