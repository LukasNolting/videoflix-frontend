import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../services/email.service';
import { SignupModel } from '../models/signup.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm: FormGroup;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  constructor(private fb: FormBuilder, private emailService: EmailService, private as: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  emailFromLanding: string = '';


  onSubmit() {
    if (this.signupForm.valid) {
      this.signUp();
    } else {
      // Visual Feedback after invalid Signup
      console.log('invalid form'); // remove when step above is done
    }
  }
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  signUp() {
    try {
      let newUser = new SignupModel(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password);
      console.log(newUser);
      
      this.as.signUPWithEmailAndPassword(newUser).subscribe(
        (response) => {
          // Sendmail Logik after Signup
          // Visual Feedback after Signup & Routing to Login Page
          console.log(response); // remove when steps above are done
          this.router.navigate(['login']);
        }
      )
    } catch (error) {
      // Visual Feedback after failed Signup
      console.log(error);
    }
  }
}
