import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }


  setEmail(email: string) {
    this.email = email;
  }
  getEmail(): string {
    return this.email;
  }
  email: string = '';

}
