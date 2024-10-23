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
import { AppComponent } from '../app.component';
import { firstValueFrom, lastValueFrom } from 'rxjs';

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
  showForgotPasswordForm: boolean = true;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private app: AppComponent
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Handles the form submission for the forgot password functionality.
   *
   * This function checks if the forgot password form is valid. If valid,
   * it attempts to send a password reset email using the AuthService.
   *
   * Upon successful email dispatch, a success dialog is shown. If the
   * email dispatch fails or an unexpected error occurs, appropriate error
   * dialogs are displayed. If the form is invalid, prompts the user to
   * enter a valid email address.
   */
  async onSubmit() {
    if (this.forgotPasswordForm.valid) {
      try {
        const response = await this.authService.forgotPassword(
          this.forgotPasswordForm.value.email
        );
        if (response.status === 200) {
          this.app.showDialog('Email sent successfully.');
          this.showForgotPasswordForm = false;
        } else {
          this.app.showDialog('Error sending email.');
        }
      } catch (error) {
        console.error('Error sending email', error);
        this.app.showDialog('An unexpected error occurred. Please try again.');
      }
    } else {
      this.app.showDialog('Please enter a valid email address.');
    }
  }
}
