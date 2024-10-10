import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private fullScreenSubject = new BehaviorSubject<boolean>(false); // flag for "rotate your device" message
  isFullScreenVisible$ = this.fullScreenSubject.asObservable(); // Observable to track changes

  private playVideoSubject = new BehaviorSubject<boolean>(false); // flag to indicate if video should be played
  playVideo$ = this.playVideoSubject.asObservable(); // Observable to track play video changes

  private showPreviewSubject = new BehaviorSubject<string>(''); // flag to indicate if video should be played
  showPreview$ = this.showPreviewSubject.asObservable(); // Observable to track play video changes
  isPreviewVideoPlaying: boolean = false;
  // mobile view variables
  isMobileViewActive: boolean = false; // main flag to check if mobile view is active
  isSmallScreenActive: boolean = false; // flag to indicate if the screen is small (mobile view < 1200px for tablets)
  showBigLogo: boolean = true; // flag to show big logo
  isLoggedIn: boolean = false; // flag to indicate if the user is logged in

  constructor() {}

  /**
   * Updates the full-screen visibility status.
   * @param {boolean} isVisible - A flag indicating if the full-screen message should be visible.
   */
  setFullScreenVisible(isVisible: boolean): void {
    this.fullScreenSubject.next(isVisible);
  }

  /**
   * Triggers the play video functionality by setting the `playVideoSubject` to true.
   */
  handlePlayVideo(): void {
    this.playVideoSubject.next(true);
    console.log('playVideo triggered');
  }

  /**
   * Resets the play video state by setting the `playVideoSubject` to false.
   */
  resetPlayVideo(): void {
    this.playVideoSubject.next(false);
  }

  /**
   * Shows a video preview by emitting the preview ID through the `showPreviewSubject`.
   * @param {number} id - The ID of the video to preview.
   */
  showPreview(path: string): void {
    this.showPreviewSubject.next(path);
    this.isPreviewVideoPlaying = true;
  }

  /**
   * Hides the currently playing video preview and resets the preview state.
   */
  hidePreview(): void {
    console.log('hidePreview triggered');
    this.isPreviewVideoPlaying = false;
  }
}
