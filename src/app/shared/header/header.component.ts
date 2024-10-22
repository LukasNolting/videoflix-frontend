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
  routerLink: string = '';
  url: string = '';
  constructor(
    private router: Router,
    public communicationService: CommunicationService
  ) {
    this.url = this.router.url;
    if (this.router.url === '/home') {
      this.communicationService.showBigLogo = false;
      this.routerLink = '/home';
    } else if (
      (this.router.url === '/imprint' || this.router.url === '/privacy') &&
      this.communicationService.isLoggedIn
    ) {
      this.communicationService.showBigLogo = true;
      this.routerLink = '/home';
    } else {
      this.communicationService.showBigLogo = true;
      this.routerLink = '/';
    }
  }

  /**
   * This function handles the logout functionality by removing the token from local and session storage,
   * updating the user's login status to false, and redirecting the user to the homepage.
   */
  handleLogout() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    this.communicationService.isLoggedIn = false;
    this.router.navigate(['/']);
    this.communicationService.showBigLogo = true;
  }
}
