import { HttpClient } from "@/api/http";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  is_admin: string;
};

export type AuthResponse = {
  token: string;
};

export type RegisterQuery = {
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
};

type PasswordChanged = { Changed: { token: string } };
type ResetResponse = "EmailSent" | PasswordChanged;

export type ResetQuery =
  | { Ask: { email: string } }
  | { Reset: { password: string; token: string } };

export type Credentials = {
  username_or_email: string;
  password: string;
};

export class UserServiceClient {
  constructor(private http: HttpClient) {}

  private static isPasswordChanged(r: ResetResponse): r is PasswordChanged {
    return typeof r === "object";
  }

  async save(apiUrl: string, user: User) {
    return this.http.postAs<User>(`${apiUrl}/api/user`, {
      body: user,
    });
  }

  async create(apiUrl: string, user: User) {
    return this.http.postAs<User>(`${apiUrl}/api/user`, {
      body: user,
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

  async me() {
    return this.http.get<AuthUser>("/api/user/me");
  }

  async login(credentials: Credentials) {
    const authResponse = await this.http.postAs<AuthResponse>(
      "/api/user/login",
      {
        body: credentials,
      },
    );
    this.http.setToken(authResponse.token);
    return authResponse;
  }

  async register(query: RegisterQuery) {
    await this.http.post("/api/user/register", { body: query });
  }

  async confirm(token: string) {
    const authResponse = await this.http.postAs<AuthResponse>(
      `/api/user/confirm/${token}`,
    );
    this.http.setToken(authResponse.token);
    return authResponse;
  }

  async reset(query: ResetQuery) {
    const resetResponse = await this.http.postAs<ResetResponse>(
      "/api/user/reset",
      { body: query },
    );
    if (UserServiceClient.isPasswordChanged(resetResponse)) {
      this.http.setToken(resetResponse.Changed.token);
    }
  }
}
