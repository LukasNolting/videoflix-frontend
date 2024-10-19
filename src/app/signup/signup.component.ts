import { Component, Injectable } from '@angular/core';
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
import { AppComponent } from '../app.component';
import { lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root',  // Stellt sicher, dass der Service global verfügbar ist
})


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
  emailFromLanding: string = ''; 
  constructor(private fb: FormBuilder, private emailService: EmailService, private as: AuthService, private router: Router, private app: AppComponent) {
    this.emailFromLanding = this.emailService.email;
    this.signupForm = this.fb.group({
      email: [this.emailFromLanding, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.emailService.email = '';
  }


  onSubmit() {
    if (this.signupForm.valid) {
      this.signUp();
    } else {
      this.app.showDialog("Invalid Form");
      console.log('invalid form');
    }
    // TODO: Prüfen, ob Rückmeldung korrekt angezeigt wird (allgemeiner Fehler, wenn E-Mail bereits vorhanden)
  }


  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }


  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }


  async signUp() {
    try {
      let newUser = new SignupModel(this.signupForm.value.username, this.signupForm.value.email, this.signupForm.value.password);
      console.log(newUser);
      const response = await lastValueFrom(
        this.as.signUPWithEmailAndPassword(newUser)
      );
      console.log(response);
      this.app.showDialog("Signup Successful");
      setTimeout(() => {
        this.router.navigate(['login']);
      },2000);
    }
    catch (error) {
      this.app.showDialog("Signup Failed");
    }
  }
}
