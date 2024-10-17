import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { Router } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EmailService } from '../services/email.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-landingsite',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    SignupComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './landingsite.component.html',
  styleUrl: './landingsite.component.scss',
})
export class LandingsiteComponent implements OnInit {
  email: string = '';
  myForm: FormGroup;
  constructor(
    private emailService: EmailService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  emailToService(email: string) {
    this.emailService.setEmail(this.email);
    this.router.navigate(['/signup']);
  }
}
