import { Routes } from '@angular/router';
import { LandingsiteComponent } from './landingsite/landingsite.component';
import { LoginComponent } from './login/login.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SignupComponent } from './signup/signup.component';
import { ImprintComponent } from './imprint/imprint.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path: '', component: LandingsiteComponent},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'resetpassword', component: ResetpasswordComponent},
    {path: 'imprint', component: ImprintComponent},
    {path: 'privacy', component: PrivacyComponent},
    {path: 'home', component: HomeComponent},
    
];
