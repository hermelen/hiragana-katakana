import { BadRequest, Conflict, NotFound, Unauthorized } from "./exception";
import { Storage } from "@/api/storage";

export class HttpClient {
  constructor(protected readonly baseUrl: string) {}

  get<T>(uri: string, options: QueryAsOptions = {}): Promise<T> {
    return this.fetchAndCheckAs<T>("GET", uri, options);
  }

  async getAsString(
    uri: string,
    options: QueryAsOptions = {},
  ): Promise<string> {
    const response = await this.fetchAndCheck("GET", uri, options);
    return await response.text();
  }

  postAs<T>(uri: string, options: QueryPostOptions = {}): Promise<T> {
    return this.fetchAndCheckAs<T>("POST", uri, options);
  }

  putAs<T>(uri: string, options: QueryPostOptions = {}): Promise<T> {
    return this.fetchAndCheckAs<T>("PUT", uri, options);
  }

  async postAsString(
    uri: string,
    options: QueryPostOptions = {},
  ): Promise<string> {
    const response = await this.fetchAndCheck("POST", uri, options);
    return await response.text();
  }

  del(uri: string, options: QueryPostOptions = {}) {
    return this.fetchAndCheck("DELETE", uri, options);
  }

  post(uri: string, options: QueryPostOptions = {}) {
    return this.fetchAndCheck("POST", uri, options);
  }

  patch(uri: string, options: QueryPostOptions = {}) {
    return this.fetchAndCheck("PATCH", uri, options);
  }

  patchAs<T>(uri: string, options: QueryPostOptions = {}): Promise<T> {
    return this.fetchAndCheckAs<T>("PATCH", uri, options);
  }

  private async fetchAndCheckAs<T>(
    method: MethodType,
    uri: string,
    options: QueryPostOptions = {},
  ): Promise<T> {
    const response = await this.fetchAndCheck(method, uri, options);
    return await response.json();
  }

  private formatBodyAsJsonIfNeeded(body?: any) {
    if (this.isRawBody(body)) {
      return body;
    }
    return JSON.stringify(body);
  }

  private isRawBody(body?: any) {
    return !body || body instanceof Blob || body instanceof FormData;
  }

  private async fetchAndCheck(
    method: MethodType,
    uri: string,
    options: QueryPostOptions = {},
  ): Promise<Response> {
    const { body } = options;
    const url = this.formatUrl(uri, options);
    const formattedBody = this.formatBodyAsJsonIfNeeded(body);
    const formattedHeaders = await this.headers(body);
    if (formattedBody) {
      console.debug("HTTP", `${method} "${url}"`, formattedBody);
    } else {
      console.debug("HTTP", `${method} "${url}"`);
    }
    const response = await fetch(url, {
      headers: formattedHeaders,
      method,
      body: formattedBody,
      credentials: "same-origin",
    });

    console.info("HTTP", `${method} "${url}" response : ${response.status}`);
    if (response.status >= 200 && response.status < 300) {
      return response;
    }

    switch (response.status) {
      case 400: {
        throw new BadRequest(await response.text());
      }

      case 404:
        throw new NotFound(await response.text());

      case 409:
        throw new Conflict(await response.text());

      case 401:
        throw new Unauthorized();

      default:
        const message = await response.text();
        console.error(
          "HTTP",
          `Unexpected error on ${method} ${uri}`,
          response.status,
          message,
        );
        throw new Error(message);
    }
  }

  private async headers(body?: any) {
    const h = new Headers();
    const token = this.getToken();
    if (token) {
      h.append("Authorization", `Bearer ${token}`);
    }
    if (!this.isRawBody(body)) {
      h.append("Content-Type", "application/json; charset=utf-8");
    }
    return h;
  }

  private formatUrl(uri: string, { params }: QueryAsOptions) {
    const url = new URL(uri, this.baseUrl);

    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) {
          if (Array.isArray(v)) {
            v.forEach((item) => url.searchParams.append(k, item.toString()));
          } else {
            url.searchParams.append(k, v.toString());
          }
        }
      }
    }
    return url.toString();
  }

  private getToken() {
    if (typeof window !== "undefined") {
      return Storage.getToken();
    }
  }

  setToken(token: string) {
    if (typeof window !== "undefined") {
      Storage.setToken(token);
    }
  }
}

type MethodType = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type QueryParams = { [k: string]: any };

export interface QueryAsOptions {
  params?: QueryParams;
  disableRefreshToken?: boolean;
}

export interface QueryPostOptions extends QueryAsOptions {
  body?: any;
}
