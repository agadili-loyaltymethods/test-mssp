export class AuthHelper {
    static TOKEN_KEY = 'rcx_auth_token';

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static setToken(token: string) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static removeToken() {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    static isAuthenticated() {
        return !!this.getToken();
    }
}