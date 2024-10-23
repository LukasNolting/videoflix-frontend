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

  /**
   * Shows a dialog with the given message for 1 second.
   * @param message The message to be shown in the dialog.
   */
  public showDialog(message: string) {
    this.message = message;
    this.dialogOpen = true;
    setTimeout(() => {
      this.dialogOpen = false;
    }, 1000);
  }

  /**
   * Checks the current viewport dimensions and sets the isMobileViewActive flag.
   */
  checkViewport() {
    const height = window.innerHeight;
    const width = window.innerWidth;
    this.communicationService.isMobileViewActive = height > width;
  }
}
