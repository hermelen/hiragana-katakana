class LocalStorage {
  getToken() {
    return window.localStorage.getItem("hkk-token");
  }

  setToken(token: string) {
    return window.localStorage.setItem("hkk-token", token);
  }

  removeToken() {
    window.localStorage.removeItem("hkk-token");
  }
}

export const Storage = new LocalStorage();
