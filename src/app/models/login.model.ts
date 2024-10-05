export class LoginModel {
    email: string;
    password: string;
    remember: boolean;
    provider?: string;  // Optional: OAuth-Provider wie 'Google', 'Facebook', etc.
    token?: string;     // Optional: OAuth-Token für die Authentifizierung

    constructor(email: string, password: string, provider?: string, token?: string) {
        this.email = email;
        this.password = password;
        this.remember = false;
        this.provider = provider;
        this.token = token;
    }
}