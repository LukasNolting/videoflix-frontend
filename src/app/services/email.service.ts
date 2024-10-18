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

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Retrieves the email address of the user signing up.
   *
   * @returns {string} - The email address of the user.
   */
  /******  26e3e969-acde-43fb-8de6-c2249b0ffecd  *******/
  getEmail(): string {
    return this.email;
  }
  email: string = '';
}
