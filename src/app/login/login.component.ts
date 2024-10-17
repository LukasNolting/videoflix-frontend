import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/login.model';
import { lastValueFrom } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root', // Stellt sicher, dass der Service global verfügbar ist
})
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isPasswordVisible: boolean = false;
  constructor(
    private fb: FormBuilder,
    private as: AuthService,
    private router: Router,
    private app: AppComponent
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      remember: [false],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const remember = localStorage.getItem('remember');
    if (token && remember === 'true') {
      //logic if token is not expired and remember is true from local storage and backend
      const rememberBoolean = remember === 'true' ? true : false;
      this.checkToken(token, rememberBoolean);
    }
  }

  async checkToken(token: string, remember: boolean) {
    try {
      const response = await lastValueFrom(this.as.checkToken(token, remember));
      this.router.navigate(['home']);
    } catch (error) {
      console.log(error);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.login();
    } else {
      this.app.showDialog('Invalid form');
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async login() {
    try {
      let user = new LoginModel(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
      const response = await lastValueFrom(
        this.as.loginWithEmailAndPassword(user)
      );
      this.app.showDialog('Login Successful');
      this.as.setToken(response.token);
      localStorage.setItem(
        'remember',
        this.loginForm.value.remember.toString()
      );
      this.router.navigate(['home']);
    } catch (error) {
      this.app.showDialog('Login Failed');
      console.log(error);
    }
  }
}
