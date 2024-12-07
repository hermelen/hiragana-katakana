class LocalStorage {
  getToken() {
    return window.localStorage.getItem("token");
  }

  setToken(token: string) {
    return window.localStorage.setItem("token", token);
  }

  removeToken() {
    window.localStorage.removeItem("token");
  }
}

export const Storage = new LocalStorage();
