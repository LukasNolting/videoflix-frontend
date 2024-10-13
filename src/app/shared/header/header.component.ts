import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { SmallLogoComponent } from '../small-logo/small-logo.component';
import { Router, RouterLink } from '@angular/router';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent, SmallLogoComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  routerLink: string = '/';
  constructor(
    private router: Router,
    public communicationService: CommunicationService
  ) {
    if (this.router.url === '/home') {
      this.communicationService.showBigLogo = false;
      this.routerLink = '/home';
    }
  }

  handleLogout() {
    this.communicationService.isLoggedIn = false;
    this.router.navigate(['/']);
  }
}
