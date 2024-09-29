import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterLink } from '@angular/router';
import { SignupComponent } from '../signup/signup.component';


@Component({
  selector: 'app-landingsite',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink, SignupComponent],
  templateUrl: './landingsite.component.html',
  styleUrl: './landingsite.component.scss',
})
export class LandingsiteComponent {}
