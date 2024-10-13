import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { VideoModel } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private videoUrl = `${environment.baseURL}/videoflix/videos/`;
  public videoSubject = new BehaviorSubject<VideoModel[]>([]);
  public videos$ = this.videoSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadVideos();
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

  addToWishlist(video: VideoModel) {
    console.log('addToWishlist', video);
  }
}
