import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  /**
   * Sets the email address for the user signing up.
   *
   * @param {string} email - The email address of the user.
   */
  setEmail(email: string) {
    this.email = email;
  }

  /**
   * Retrieves the email address of the user signing up.
   *
   * @returns {string} - The email address of the user.
   */
  getEmail(): string {
    return this.email;
  }
  email: string = '';
}
