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

  async save(word: Word) {
    return this.http.postAs<Word>("/api/word", {
      body: word,
    });
  }

  async create(word: Word) {
    return this.http.postAs<Word>("/api/word", {
      body: word,
    });
  }

  async list() {
    return this.http.get<Word[]>("/api/word");
  }

  async get(id: string) {
    return this.http.get<Word[]>(`/api/word/${id}`);
  }

  async delete(id: string) {
    return this.http.del(`/api/word/${id}`);
  }
}
