const TOKEN_KEY = 'OAuthToken';

export function removeToken() {
    window.localStorage.removeItem(TOKEN_KEY);
}

export function removeSession() {
    window.localStorage.clear();
}

export function saveToken(token: string) {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
}