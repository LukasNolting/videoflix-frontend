import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { CarouselComponent } from 'ngx-carousel-ease';
import { DatabaseService } from '../services/database.service';
import { VideoModel } from '../models/video.model';
import { ContinueWatching } from '../models/continue-watching';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterLink,
    VideoPlayerComponent,
    VideoPlayerComponent,
    CarouselComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewChecked {
  public newVideos: VideoModel[] = [];
  public actionVideos: VideoModel[] = [];
  public documentaryVideos: VideoModel[] = [];
  public scifiVideos: VideoModel[] = [];
  public horrorVideos: VideoModel[] = [];
  public favoriteVideos: VideoModel[] = [];
  public continueWatchingVideos: ContinueWatching[] = [];
  public baseUrl = 'http://127.0.0.1:8000/media/'; // to do use env for backend route
  public favoriteVideoIds: number[] = [];
  public Math = Math;
  constructor(
    private router: Router,
    public communicationService: CommunicationService,
    public databaseService: DatabaseService
  ) {
    if (this.router.url === '/home') {
      this.communicationService.isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.loadVideos();
    this.loadFavoriteVideos();
    this.loadContinueWatchingVideos();
  }
  ngAfterViewChecked(): void {
    if (
      this.favoriteVideos.length > 0 &&
      !this.databaseService.isFavCarouselRendered
    ) {
      this.databaseService.isFavCarouselRendered = true;
      this.databaseService.reloadFavoriteVideos = false;
    }
    if (
      this.continueWatchingVideos.length > 0 &&
      !this.databaseService.isContinueWatchingCarouselRendered
    ) {
      this.databaseService.isContinueWatchingCarouselRendered = true;
      this.databaseService.reloadContinueWatchingVideos = false;
    }
  }

  private loadVideos(): void {
    this.databaseService.loadVideos();
    this.databaseService.getVideos().subscribe((videos) => {
      this.newVideos = videos.filter((video) => {
        const createdAtDate = new Date(video.created_at);
        const comparisonDate = new Date('2024-09-12T09:12:11Z');
        return createdAtDate > comparisonDate;
      });
      this.actionVideos = videos.filter((video) => video.category === 'action');
      this.documentaryVideos = videos.filter(
        (video) => video.category === 'documentary'
      );
      this.scifiVideos = videos.filter((video) => video.category === 'sci-fi');
      this.horrorVideos = videos.filter((video) => video.category === 'horror');
      this.setDataIsLoaded(videos);
    });
  }

  private loadFavoriteVideos(): void {
    this.databaseService.loadFavoriteVideos();
    this.databaseService.getFavoriteVideos().subscribe((favoriteVideos) => {
      this.favoriteVideos = favoriteVideos;
      this.favoriteVideoIds = favoriteVideos.map((video) => video.id);
    });
  }

  private loadContinueWatchingVideos(): void {
    this.databaseService.loadContinueWatchingVideos();
    this.databaseService
      .getContinueWatchingVideos()
      .subscribe((continueWatchingVideos) => {
        this.continueWatchingVideos = continueWatchingVideos;
      });
  }

  private setDataIsLoaded(videos: VideoModel[]): void {
    setTimeout(() => {
      if (videos.length > 0) {
        this.communicationService.dataIsLoaded = true;
      }
    }, 3000);
  }

  handleAddToWishlist(video: VideoModel, event: Event) {
    event.stopPropagation();
    this.databaseService.toggleFavourites(video);
  }
}
