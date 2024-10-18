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

  constructor(private http: HttpClient) {}

  get headers() {
    return new HttpHeaders().set(
      'Authorization',
      'Token ' +
        (localStorage.getItem('token') || sessionStorage.getItem('token'))
    );
  }

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

  public getVideos(): Observable<VideoModel[]> {
    return this.videos$;
  }

  async toggleFavourites(video: VideoModel): Promise<void> {
    const body = { video_id: video.id };
    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.videoFavoriteUrl, body, {
          headers: this.headers,
        })
      );
      console.log('Request erfolgreich:', response);
      this.reloadFavoriteVideos = true;
    } catch (error) {
      console.error('Request-Fehler:', error);
    } finally {
      this.loadFavoriteVideos();
      setTimeout(() => {
        this.reloadFavoriteVideos = false;
      }, 200);
    } // TODO : Refactor? kinda buggy
  }

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
      .subscribe();
  }

  public getFavoriteVideos(): Observable<VideoModel[]> {
    return this.favoriteVideos$;
  }

  public async loadContinueWatchingVideos(): Promise<void> {
    this.http
      .get<ContinueWatching[]>(this.continueWatchingUrl, {
        headers: this.headers,
      })
      .pipe(
        tap((continueWatchingVideos) => {
          this.continueWatchingSubject.next(continueWatchingVideos);
          console.log(
            'Continue watching Videos loaded:',
            continueWatchingVideos
          );
        }),
        catchError((error) => {
          console.error('Error loading continue watching videos:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  public getContinueWatchingVideos(): Observable<ContinueWatching[]> {
    return this.continueWatchingVideos$;
  }

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
