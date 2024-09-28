import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo.component';
import { SmallLogoComponent } from '../small-logo/small-logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [LogoComponent,SmallLogoComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
