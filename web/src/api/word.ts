import { HttpClient } from "@/api/http";
import { UUID } from "node:crypto";

export interface Word {
  id?: UUID;
  roman: string;
  hiragana?: string;
  katakana?: string;
  kanji?: string;
}

export class WordServiceClient {
  constructor(private http: HttpClient) {}

  async save(apiUrl: string, word: Word) {
    return this.http.postAs<Word>(`${apiUrl}/api/word`, {
      body: word,
    });
  }

  async create(apiUrl: string, word: Word) {
    return this.http.postAs<Word>(`${apiUrl}/api/word`, {
      body: word,
    });
  }

  async list(apiUrl: string) {
    return this.http.get<Word[]>(`${apiUrl}/api/word`);
  }

  async get(apiUrl: string, id: string) {
    return this.http.get<Word[]>(`${apiUrl}/api/word/${id}`);
  }

  async delete(apiUrl: string, id: string) {
    return this.http.del(`${apiUrl}/api/word/${id}`);
  }
}
