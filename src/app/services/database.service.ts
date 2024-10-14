import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VideoModel } from '../models/video.model';
import { firstValueFrom } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private videoUrl = `${environment.baseURL}/videoflix/videos/`;
  public videoSubject = new BehaviorSubject<VideoModel[]>([]);
  public videos$ = this.videoSubject.asObservable();

  private videoFavoriteUrl = `${environment.baseURL}/videoflix/favorite/`;
  public videoFavoriteSubject = new BehaviorSubject<VideoModel[]>([]);
  public favoriteVideos$ = this.videoFavoriteSubject.asObservable();

  public reloadFavoriteVideos: boolean = false;

  constructor(
    private http: HttpClient,
    private communicationService: CommunicationService
  ) {
    this.loadVideos();
    this.loadFavoriteVideos();
  }

  get headers() {
    return new HttpHeaders().set(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
  }

  public loadVideos(): void {
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
    const link = `${environment.baseURL}/videoflix/favorite/`;

    console.log('videoobjekt:', video);
    console.log('service:', body);
    console.log(link);

    try {
      const response = await firstValueFrom(
        this.http.post<any>(link, body, { headers: this.headers })
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

  public loadFavoriteVideos(): void {
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
}
