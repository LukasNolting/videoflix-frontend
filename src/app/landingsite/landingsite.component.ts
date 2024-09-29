import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-landingsite',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterLink],
  templateUrl: './landingsite.component.html',
  styleUrl: './landingsite.component.scss',
})
export class LandingsiteComponent {}
