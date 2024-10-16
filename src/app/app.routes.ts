import { Routes } from '@angular/router';
import { LandingsiteComponent } from './landingsite/landingsite.component';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './reset-password/reset-password.component';
import { SignupComponent } from './signup/signup.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { HomeComponent } from './home/home.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingsiteComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'password-reset/:token', component: ResetpasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
];
