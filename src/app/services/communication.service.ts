import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoModel } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private playVideoSubject = new BehaviorSubject<string>('');
  playVideo$ = this.playVideoSubject.asObservable();

  private showPreviewSubject = new BehaviorSubject<string>('');
  showPreview$ = this.showPreviewSubject.asObservable();
  isPreviewVideoPlaying: boolean = false;
  showVideoDescription: boolean = true;
  isMobileViewActive: boolean = false;
  showBigLogo: boolean = true;
  isLoggedIn: boolean = false;
  dataIsLoaded: boolean = false;

  public currentVideoObj: VideoModel = {} as VideoModel;
  public currentPlayedTime: number = 0;
  public continuePlayTime: number = 0;

  showVideoPlayerPopup: boolean = false;
  private showVideoPlayerPopupSubject = new BehaviorSubject<boolean>(false);
  showVideoPlayerPopup$ = this.showVideoPlayerPopupSubject.asObservable();

  public favoriteVideoIds: number[] = [];

  private showImprintSubject = new BehaviorSubject<boolean>(false);
  private showPrivacySubject = new BehaviorSubject<boolean>(false);

  showImprint$ = this.showImprintSubject.asObservable();
  showPrivacy$ = this.showPrivacySubject.asObservable();

  /**
   * Updates the visibility state of the imprint overlay.
   *
   * @param {boolean} value - A flag indicating whether to show (true) or hide (false) the imprint overlay.
   */
  setShowImprint(value: boolean): void {
    this.showImprintSubject.next(value);
  }

  /**
   * Updates the visibility state of the privacy overlay.
   *
   * @param {boolean} value - A flag indicating whether to show (true) or hide (false) the privacy overlay.
   */
  setShowPrivacy(value: boolean): void {
    this.showPrivacySubject.next(value);
  }

  /**
   * Triggers the play video functionality by setting the `playVideoSubject` to true.
   */
  handlePlayVideo(video: VideoModel, timestamp: number): void {
    this.continuePlayTime = timestamp;
    this.playVideoSubject.next(video.video_file);
    this.showVideoPlayerPopup = true;
    this.togglePopup(true);
    this.currentVideoObj = video;
  }

  /**
   * Shows a video preview by emitting the preview ID through the `showPreviewSubject`.
   * @param {number} id - The ID of the video to preview.
   */
  showPreview(path: string, video: VideoModel): void {
    this.showPreviewSubject.next(path);
    this.isPreviewVideoPlaying = true;
    this.currentVideoObj = video;
  }

  /**
   * Hides the currently playing video preview and resets the preview state.
   */
  hidePreview(): void {
    this.isPreviewVideoPlaying = false;
  }

  /**
   * Toggles the visibility of the video player popup by emitting the given state
   * through the `showVideoPlayerPopupSubject`.
   *
   * @param {boolean} show - A flag indicating whether to show (true) or hide (false) the video player popup.
   */
  togglePopup(show: boolean) {
    this.showVideoPlayerPopupSubject.next(show);
  }
}
