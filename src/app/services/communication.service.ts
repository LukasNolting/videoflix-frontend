import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  // mobile view variables
  private fullScreenSubject = new BehaviorSubject<boolean>(false); // flag for "rotate your device" message
  isFullScreenVisible$ = this.fullScreenSubject.asObservable(); // Observable to track changes

  private playVideoSubject = new BehaviorSubject<boolean>(false); // flag to indicate if video should be played
  playVideo$ = this.playVideoSubject.asObservable(); // Observable to track play video changes

  private showPreviewSubject = new BehaviorSubject<number>(0); // flag to indicate if video should be played
  showPreview$ = this.showPreviewSubject.asObservable(); // Observable to track play video changes

  isMobileViewActive: boolean = false; // main flag to check if mobile view is active
  isSmallScreenActive: boolean = false; // flag to indicate if the screen is small (mobile view < 1200px for tablets)
  showBigLogo: boolean = true; // flag to show big logo
  isLoggedIn: boolean = false; // flag to indicate if the user is logged in

  constructor() {}

  setFullScreenVisible(isVisible: boolean): void {
    this.fullScreenSubject.next(isVisible);
  }

  handlePlayVideo(): void {
    this.playVideoSubject.next(true);
    console.log('playVideo triggered');
  }
  resetPlayVideo(): void {
    this.playVideoSubject.next(false);
  }

  showPreview(id: number): void {
    console.log('showPreview triggered', id);
    this.showPreviewSubject.next(id);
  }
}
