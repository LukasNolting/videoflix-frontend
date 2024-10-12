import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // todo validate email check if exists in db
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      try {
      console.log(this.forgotPasswordForm.value);
      this.authService
        .forgotPassword(this.forgotPasswordForm.value.email)
          console.log('Email sent successfully', Response);
     
        } catch (error) {
          
          console.error('Error sending email', error);
        }
    }
  }
}
