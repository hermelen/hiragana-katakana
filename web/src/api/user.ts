import { HttpClient } from "@/api/http";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
};

export type AuthResponse = {
  token: string;
};

export type RegisterQuery = {
  username: string;
  email: string;
  password: string;
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

  private static isPasswordChanged(r: ResetResponse): r is PasswordChanged {
    return typeof r === "object";
  }
}
