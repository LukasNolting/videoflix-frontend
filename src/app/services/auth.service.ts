import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { SignupModel } from '../models/signup.model';
import { LoginModel } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //todo: do wee need that?
  private currentPathSubject: BehaviorSubject<string> =
    new BehaviorSubject<string>('');
  public currentPath$: Observable<string> =
    this.currentPathSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
  /**
   * Updates the current path observable with the current URL of the router.
   */
  getCurrentURL() {
    this.currentPathSubject.next(this.router.url.replace('/', ''));
  }

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

  forgotPassword(email: string) {
    
    console.log('email: ' + email);

    const body = { email: email };
    console.log('service: ' + body);

    fetch(`${environment.baseURL}/videoflix/password-reset/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  resetPassword(token: any, password: string) {
    const body = { password: password };
    console.log('service: ' + body);

    fetch(`${environment.baseURL}/videoflix/password-reset/${token}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  }

  // forgotPassword(email: string) {
  //   const body = { email: email };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   console.log('email:', email);
  //   console.log('service:', body);
    
  //   const link =  `${environment.baseURL}/videoflix/password-reset/`
  //   console.log(link);
    

  //   return this.http.post<any>(
  //     `${environment.baseURL}/videoflix/password-reset/`,
  //     body,
  //     { headers }
  //   );
  // }

  // resetPassword(token: any, password: string): Observable<any> {
  //   const body = { password: password };
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  //   console.log('service:', body);

  //   return this.http.post<any>(
  //     `${environment.baseURL}/videoflix/password-reset/${token}/`,
  //     body,
  //     { headers }
  //   );
  // }

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
