import { Component } from '@angular/core';
import { PrivacyComponent } from '../../privacy/privacy.component';
import { ImprintComponent } from '../../imprint/imprint.component';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [PrivacyComponent, ImprintComponent, RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  rightAlignFooter: boolean = false;
  constructor(private router: Router) {
    if (this.router.url === '/home') {
      this.rightAlignFooter = true;
    }
  }
}
