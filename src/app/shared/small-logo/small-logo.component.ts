import { Component } from '@angular/core';

@Component({
  selector: 'app-small-logo',
  standalone: true,
  imports: [],
  template: `
  <div class="small-logo">
    <svg width="27" height="15" viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.71 0.0499866C1.09 0.229987 1.47 0.419987 1.84 0.599987C3.6 1.44999 5.35 2.30999 7.11 3.15999C9.55 4.33999 11.98 5.52999 14.42 6.70999C16.7 7.81999 18.98 8.92999 21.26 10.03C23 10.88 24.74 11.77 26.54 12.49C25.26 12.23 23.91 12.62 22.73 13.12C21.71 13.56 20.73 14.1 19.72 14.57C18.62 15.08 17.35 15.08 16.24 14.59L6.22 10.14C2.44 8.46999 0 4.67999 0 0.499987C0 0.129987 0.38 -0.110013 0.71 0.0499866Z" fill="url(#paint0_linear_62_30)"/>
      <defs>
        <linearGradient id="paint0_linear_62_30" x1="13.27" y1="14.96" x2="13.27" y2="-1.3504e-05" gradientUnits="userSpaceOnUse">
          <stop stop-color="#3547FF"/>
          <stop offset="1" stop-color="#8903FF"/>
        </linearGradient>
      </defs>
    </svg>

    <svg class="lower-logo" width="32" height="19" viewBox="0 0 32 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31.3 4.17L4.3 17.36L1.11 18.92C0.6 19.17 0 18.79 0 18.22V17.13C0 14.08 1.67 11.3 4.3 9.88C4.48 9.78 4.66 9.7 4.84 9.61L19.4 3L24 0.940002C24.34 0.790002 24.69 0.670003 25.05 0.580003C25.75 0.400003 26.47 0.340002 27.19 0.400002C27.98 0.470002 28.75 0.680003 29.48 1.03L31.3 1.91C32.24 2.37 32.24 3.72 31.3 4.17Z" fill="url(#paint0_linear_62_31)"/>
      <defs>
        <linearGradient id="paint0_linear_62_31" x1="-0.94" y1="17" x2="30.06" y2="0.500001" gradientUnits="userSpaceOnUse">
        <stop stop-color="#8903FF"/>
        <stop offset="1" stop-color="#3547FF"/>
        </linearGradient>
      </defs>
    </svg>
  </div>`,
  styleUrl: './small-logo.component.scss'
})
export class SmallLogoComponent {

}
