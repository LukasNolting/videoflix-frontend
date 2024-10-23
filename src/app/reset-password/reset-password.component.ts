import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  showResetPasswordForm: boolean = true;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private app: AppComponent,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  token: string | null = null;

  /**
   * Called when the component is initialized.
   *
   * Gets the token from the route and checks its validity.
   */
  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token');
    this.authService.checkTokenValidity(this.token);
  }

  /**
   * Handles the form submission for the reset password functionality.
   *
   * This function checks if the reset password form is valid. If valid,
   * it attempts to send a password reset request using the AuthService.
   *
   * Upon successful password reset, a success dialog is shown. If the
   * password reset fails or an unexpected error occurs, appropriate error
   * dialogs are displayed. If the form is invalid, prompts the user to
   * enter a valid password and confirm it.
   */
  async onSubmit() {
    if (this.resetPasswordForm.valid) {
      try {
        console.log(this.resetPasswordForm.value);
        const response = await this.authService.resetPassword(
          this.token,
          this.resetPasswordForm.value.password
        );

        if (response.status === 200) {
          this.app.showDialog('Password reset successfully!');
          this.showResetPasswordForm = false;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        } else {
          this.app.showDialog('Error resetting password.');
        }
      } catch (error) {
        console.warn('Error setting password', error);
        this.app.showDialog('An unexpected error occurred.');
      }
    }
  }

  /**
   * Toggles the visibility of the password input field.
   * Logs the current visibility state for debugging purposes.
   */
  togglePasswordVisibility(): void {
    console.log(this.isPasswordVisible);
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Toggles the visibility of the confirm password input field.
   * Logs the current visibility state for debugging purposes.
   */
  toggleConfirmPasswordVisibility(): void {
    console.log(this.isConfirmPasswordVisible);
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
