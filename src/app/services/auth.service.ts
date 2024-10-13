import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SignupModel } from '../models/signup.model';
import { LoginModel } from '../models/login.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }


  /**
   * Sends a POST request to log in a user with email and password.
   *
   * @param {string} username - The username or email of the user.
   * @param {string} password - The password of the user.
   * @param {boolean} remember - Whether to remember the user or not.
   * @returns {Observable<any>} - An observable with the response from the server.
   */
  loginWithEmailAndPassword(User: LoginModel): Observable<any> {
    return this.http.post<any>(`${environment.baseURL}/videoflix/login/`, User);
  }

  /**
   * Sends a POST request to sign up a new user with email and password.
   *
   * @param {string} username - The username of the user.
   * @param {string} lastname - The last name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Observable<Object>} - An observable with the response from the server.
   */
  signUPWithEmailAndPassword(newUser: SignupModel): Observable<Object> {
    return this.http.post(`${environment.baseURL}/videoflix/signup/`, newUser);
  }

  async forgotPassword(email: string): Promise<void> {
    const body = { email };
    const link = `${environment.baseURL}/videoflix/password-reset/`;

    console.log('email:', email);
    console.log('service:', body);
    console.log(link);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(link, body, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
      console.log('Request erfolgreich:', response);
    } catch (error) {
      console.error('Request-Fehler:', error);
    }
  }

  async resetPassword(token: any, password: string): Promise<void> {
    const body = { password };
    const link = `${environment.baseURL}/videoflix/password-reset/${token}/`;

    console.log('service:', body);
    console.log(link);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(link, body, {
          headers: { 'Content-Type': 'application/json' },
        })
      );
      console.log('Request erfolgreich:', response);
    } catch (error) {
      console.error('Request-Fehler:', error);
    }
  }

  /**
   * Stores the provided token in local storage.
   *
   * @param {string} token - The token to be stored.
   */
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves the token from local storage.
   *
   * @returns {string | null} - The stored token or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
