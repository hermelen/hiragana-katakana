import { HttpClient } from "@/api/http";
import { UUID } from "node:crypto";

export type User = {
  id: UUID;
  username: string;
  email: string;
  password: string;
  is_admin: string;
};

export class UserServiceClient {
  constructor(private http: HttpClient) {}

  async save(apiUrl: string, program: User) {
    return this.http.postAs<string>(`${apiUrl}/api/user`, {
      body: program,
    });
  }

  async list(apiUrl: string) {
    return this.http.get<User[]>(`${apiUrl}/api/user`);
  }

  async get(apiUrl: string, id: string) {
    return this.http.get<User[]>(`${apiUrl}/api/user/${id}`);
  }

  async delete(apiUrl: string, id: string) {
    return this.http.del(`${apiUrl}/api/user/${id}`);
  }
}
