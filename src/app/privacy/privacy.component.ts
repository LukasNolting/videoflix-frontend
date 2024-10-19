import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {}
