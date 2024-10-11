import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  //to do: we could outsource to communictaion service

  setEmail(email: string) {
    this.email = email;
  }
  getEmail(): string {
    return this.email;
  }
  email: string = '';
}
