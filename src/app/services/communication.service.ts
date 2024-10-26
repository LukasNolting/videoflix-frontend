import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoModel } from '../models/video.model';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private playVideoSubject = new BehaviorSubject<boolean>(false); // flag to indicate if video should be played
  playVideo$ = this.playVideoSubject.asObservable(); // Observable to track play video changes

  private showPreviewSubject = new BehaviorSubject<string>(''); // flag to indicate if video should be played
  showPreview$ = this.showPreviewSubject.asObservable(); // Observable to track play video changes
  isPreviewVideoPlaying: boolean = false;
  showVideoDescription: boolean = true;
  // mobile view variable
  isMobileViewActive: boolean = false; // main flag to check if mobile view is active
  //header variables
  showBigLogo: boolean = true; // flag to show big logo
  isLoggedIn: boolean = false; // flag to indicate if the user is logged in

  // loading screen variables
  dataIsLoaded: boolean = false; // flag to indicate if the data is loaded

  // video player variables
  public currentVideoObj: VideoModel = {} as VideoModel;
  public currentPlayedTime: number = 0;
  public continuePlayTime: number = 0;

  // video player popup variables
  showVideoPlayerPopup: boolean = false;

  constructor(private databaseService: DatabaseService) {}

  /**
   * Triggers the play video functionality by setting the `playVideoSubject` to true.
   */
  handlePlayVideo(path: string, video: VideoModel): void {
    this.playVideoSubject.next(true);
    this.showVideoPlayerPopup = true;
    this.currentVideoObj = video;
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
   * Triggers the video player to continue watching a video from the specified timestamp.
   * @param {VideoModel} video - The video object to continue watching.
   * @param {number} timestamp - The timestamp in seconds to continue watching from.
   */
  continueWatching(video: VideoModel, timestamp: number): void {
    this.continuePlayTime = timestamp;
    this.currentVideoObj = video;
    this.playVideoSubject.next(true);
  }
}
