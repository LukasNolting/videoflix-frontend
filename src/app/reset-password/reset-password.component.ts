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
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private authService: AuthService) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  token: string | null = null;

  ngOnInit(): void {
    // Holen des Tokens aus der URL
    this.token = this.route.snapshot.paramMap.get('token');
    console.log('Token:', this.token);
  }

  onSubmit() {
  if (this.resetPasswordForm.valid) {
    try {
      console.log(this.resetPasswordForm.value);
      this.authService.resetPassword(this.token, 'noreply@lukas-nolting.de', this.resetPasswordForm.value.password);
      console.log('Password set!', Response);
    } catch (error) {
      console.error('Error setting password', error);
    }
  }
  }

  togglePasswordVisibility(): void {
    console.log(this.isPasswordVisible);
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    console.log(this.isConfirmPasswordVisible);
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }
}
