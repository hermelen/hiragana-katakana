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

  async save(apiUrl: string, backendName: string, program: Syllable) {
    return this.http.postAs<string>(`${apiUrl}/api/${backendName}/syllable`, {
      body: program,
    });
  }

  async list(apiUrl: string, backendName: string) {
    return this.http.get<Syllable[]>(`${apiUrl}/api/${backendName}/syllable`);
  }

  async get(apiUrl: string, backendName: string, id: string) {
    return this.http.get<Syllable[]>(
      `${apiUrl}/api/${backendName}/syllable/${id}`,
    );
  }

  async delete(apiUrl: string, backendName: string, id: string) {
    return this.http.del(`${apiUrl}/api/${backendName}/syllable/${id}`);
  }
}
