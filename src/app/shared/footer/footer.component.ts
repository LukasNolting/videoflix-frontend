import { Component } from '@angular/core';
import { PrivacyComponent } from '../../privacy/privacy.component';
import { ImprintComponent } from '../../imprint/imprint.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [PrivacyComponent, ImprintComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
