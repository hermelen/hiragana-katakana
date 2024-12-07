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

  async save(apiUrl: string, backendName: string, word: Word) {
    return this.http.postAs<Word>(`${apiUrl}/api/${backendName}/word`, {
      body: word,
    });
  }

  async create(apiUrl: string, backendName: string, word: Word) {
    return this.http.postAs<Word>(`${apiUrl}/api/${backendName}/word`, {
      body: word,
    });
  }

  async list(apiUrl: string, backendName: string) {
    return this.http.get<Word[]>(`${apiUrl}/api/${backendName}/word`);
  }

  async get(apiUrl: string, backendName: string, id: string) {
    return this.http.get<Word[]>(`${apiUrl}/api/${backendName}/word/${id}`);
  }

  async delete(apiUrl: string, backendName: string, id: string) {
    return this.http.del(`${apiUrl}/api/${backendName}/word/${id}`);
  }
}
