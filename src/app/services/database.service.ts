import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VideoModel } from '../models/video.model';
import { firstValueFrom } from 'rxjs';
import { ContinueWatching } from '../models/continue-watching';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private videoUrl = `${environment.baseUrl}/videoflix/videos/`;
  public videoSubject = new BehaviorSubject<VideoModel[]>([]);
  public videos$ = this.videoSubject.asObservable();

  private videoFavoriteUrl = `${environment.baseUrl}/videoflix/favorite/`;
  public videoFavoriteSubject = new BehaviorSubject<VideoModel[]>([]);
  public favoriteVideos$ = this.videoFavoriteSubject.asObservable();

  private continueWatchingUrl = `${environment.baseUrl}/videoflix/continue-watching/`;
  public continueWatchingSubject = new BehaviorSubject<ContinueWatching[]>([]);
  public continueWatchingVideos$ = this.continueWatchingSubject.asObservable();

  public reloadFavoriteVideos: boolean = false;
  public reloadContinueWatchingVideos: boolean = false;
  public isFavCarouselRendered: boolean = false;
  public isContinueWatchingCarouselRendered: boolean = false;

  constructor(private http: HttpClient) {}

  /**
   * Returns an instance of HttpHeaders with the 'Authorization' header set to
   * 'Token <token>', where <token> is the value of the 'token' key in either
   * localStorage or sessionStorage, whichever one has it.
   */
  get headers() {
    return new HttpHeaders().set(
      'Authorization',
      'Token ' +
        (localStorage.getItem('token') || sessionStorage.getItem('token'))
    );
  }

  /**
   * Loads all videos from the server and emits them through the `videos$`
   * observable. If the request fails, it emits an empty array.
   */
  public async loadVideos(): Promise<void> {
    this.http
      .get<VideoModel[]>(this.videoUrl, { headers: this.headers })
      .pipe(
        tap((videos) => {
          this.videoSubject.next(videos);
          console.log('Videos loaded:', videos);
        }),
        catchError((error) => {
          console.error('Error loading videos:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable that emits an array of VideoModel objects.
   */
  public getVideos(): Observable<VideoModel[]> {
    return this.videos$;
  }

  /**
   * Toggles the favorite status of the given video. If the request fails, it
   * does not do anything.
   * @param video The video to toggle.
   */
  async toggleFavourites(video: VideoModel): Promise<void> {
    const body = { video_id: video.id };
    this.reloadFavoriteVideos = true;
    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.videoFavoriteUrl, body, {
          headers: this.headers,
        })
      );
      await this.loadFavoriteVideos();
    } catch (error) {
      console.error('Request-Fehler:', error);
    }
  }

  /**
   * Loads the favorite videos of the logged in user.
   * This method requests the favorite videos from the server and stores them in
   * the videoFavoriteSubject. If the request fails, it does not do anything.
   * To force a reload of the favorite videos, set the reloadFavoriteVideos property
   * to true.
   * @returns A promise that resolves when the request has finished.
   */
  public async loadFavoriteVideos(): Promise<void> {
    this.http
      .get<VideoModel[]>(this.videoFavoriteUrl, { headers: this.headers })
      .pipe(
        tap((favoriteVideos) => {
          this.videoFavoriteSubject.next(favoriteVideos);
          console.log('Favorite Videos loaded:', favoriteVideos);
        }),
        catchError((error) => {
          console.error('Error loading favorite videos:', error);
          return of([]);
        })
      )
      .subscribe({
        complete: () => {
          this.reloadFavoriteVideos = false;
        },
      });
  }

  /**
   * Returns an observable that emits the favorite videos of the logged in user.
   * If the user is not logged in, the observable will emit an empty array.
   * The observable will only emit a new value when the favorite videos have
   * been reloaded from the server.
   * @returns An observable that emits the favorite videos of the logged in user.
   */
  public getFavoriteVideos(): Observable<VideoModel[]> {
    return this.favoriteVideos$;
  }

  /**
   * Loads the videos that the user has saved to continue watching.
   * This method requests the continue watching videos from the server and stores
   * them in the continueWatchingSubject. If the request fails, it does not do
   * anything.
   * To force a reload of the continue watching videos, set the
   * reloadContinueWatchingVideos property to true.
   * @returns A promise that resolves when the request has finished.
   */
  public async loadContinueWatchingVideos(): Promise<void> {
    this.reloadContinueWatchingVideos = true;
    try {
      const continueWatchingVideos = await firstValueFrom(
        this.http.get<ContinueWatching[]>(this.continueWatchingUrl, {
          headers: this.headers,
        })
      );
      this.continueWatchingSubject.next(continueWatchingVideos);
    } catch (error) {
      console.warn('Error loading continue watching videos:', error);
    } finally {
      this.reloadContinueWatchingVideos = false;
    }
  }

  /**
   * Returns an observable that emits the videos that the user has saved to
   * continue watching. This observable will only emit a new value when the
   * continue watching videos have been reloaded from the server.
   * @returns An observable that emits the videos that the user has saved to
   * continue watching.
   */
  public getContinueWatchingVideos(): Observable<ContinueWatching[]> {
    return this.continueWatchingVideos$;
  }

  /**
   * Saves the given video to the continue watching list with the given played
   * time.
   * @param video The video to save to the continue watching list.
   * @param playedTime The time in seconds that has been played.
   * @returns A promise that resolves when the request has finished.
   */
  async saveVideoToContinueWatching(
    video: VideoModel,
    playedTime: number
  ): Promise<void> {
    console.log('saveVideoToContinueWatching:', video);
    console.log('playedTime:', playedTime);

    const body = { video_id: video.id, timestamp: playedTime };
    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.continueWatchingUrl, body, {
          headers: this.headers,
        })
      );
      console.log('Request erfolgreich:', response);
    } catch (error) {
      console.error('Request-Fehler:', error);
    } finally {
      this.loadContinueWatchingVideos();
    }
  }

  // todo : check if video is saved in continue watching list before trying to delete
  public async deleteVideoFromContinueWatching(videoId: number): Promise<void> {
    console.log('deleteVideoFromContinueWatching:', videoId);

    const body = { video_id: videoId };
    try {
      await firstValueFrom(
        this.http.delete<any>(this.continueWatchingUrl, {
          headers: this.headers,
          body: body,
        })
      );
      console.log('Video successfully deleted from continue watching.');

      this.loadContinueWatchingVideos();
    } catch (error) {
      console.error(
        'Error deleting video from continue watching Videos:',
        error
      );
    }
  }
}
