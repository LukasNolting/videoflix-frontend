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
  public favoriteVideos$ = this.videoSubject.asObservable();

  constructor(private http: HttpClient, private communicationService: CommunicationService) {
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
    } catch (error) {
      console.error('Request-Fehler:', error);
    }
    finally {
      this.loadFavoriteVideos();
      this.communicationService.dataIsLoaded = false;
      setTimeout(() => {
        this.communicationService.dataIsLoaded = true;
      }, 2000);
    } // TODO : Refactor?
  }

  public loadFavoriteVideos(): void {
    this.http
      .get<VideoModel[]>(this.videoFavoriteUrl, { headers: this.headers })
      .pipe(
        tap((videos) => {
          this.videoFavoriteSubject.next(videos);
          console.log('Favorite Videos loaded:', videos);
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
