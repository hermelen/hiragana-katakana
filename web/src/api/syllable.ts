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

  async list() {
    return this.http.get<Syllable[]>("/api/syllable");
  }

  async get(id: string) {
    return this.http.get<Syllable[]>(`/api/syllable/${id}`);
  }

  async delete(id: string) {
    return this.http.del(`/api/syllable/${id}`);
  }
}
