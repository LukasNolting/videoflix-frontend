import { Component, HostListener, inject, Input, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommunicationService } from './services/communication.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  message = '';
  @Input() dialogOpen: boolean;
  title = 'videoflix_frontend';
  communicationService = inject(CommunicationService);
  ngOnInit() {
    this.checkViewport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkViewport();
  }


  constructor() { 
    this.dialogOpen = false;
  }

  public showDialog(message: string) {
    this.message = message;
    this.dialogOpen = true;
    setTimeout(() => {
      this.dialogOpen = false;
    },1000)
  }


  /**
   * Checks the current viewport dimensions and sets the isMobileViewActive flag.
   */
  checkViewport() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    // Flag for mobile view (height greater than width)
    this.communicationService.isMobileViewActive = height > width;
    // Flag to show rotate device prompt (ratio greater than 1) only for smaller screens
    const ratio = width / height;
    const isSmartPhoneScreen = width < 1024;
    //const shouldShowFullScreen = ratio > 1.3 && isSmartPhoneScreen;

    //this.communicationService.setFullScreenVisible(shouldShowFullScreen);
    //console.log('fullscreenmode', shouldShowFullScreen);
    // Flag for small screen (tablet view)
    const isTabletScreen = width < 1450;
    this.communicationService.isSmallScreenActive = isTabletScreen;
  }
}
