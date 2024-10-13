import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { CarouselComponent } from 'ngx-carousel-ease';
import { DatabaseService } from '../services/database.service';
import { VideoModel } from '../models/video.model';
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
export class HomeComponent implements OnInit {
  public newVideos: VideoModel[] = [];
  public actionVideos: VideoModel[] = [];
  public documentaryVideos: VideoModel[] = [];
  public scifiVideos: VideoModel[] = [];
  public horrorVideos: VideoModel[] = [];

  public baseUrl = 'http://127.0.0.1:8000/media/'; // to do use env for backend route
  constructor(
    private router: Router,
    public communicationService: CommunicationService,
    public databaseService: DatabaseService
  ) {
    if (this.router.url === '/videoflix/home') {
      this.communicationService.isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.databaseService.getVideos().subscribe((videos) => {
      this.newVideos = videos.filter(
        (video) => video.created_at > '2024-09-12T09:12:11Z' // to do implement date filter
      );
      this.actionVideos = videos.filter((video) => video.category === 'action');
      this.documentaryVideos = videos.filter(
        (video) => video.category === 'documentary'
      );
      this.scifiVideos = videos.filter((video) => video.category === 'sci-fi');
      this.horrorVideos = videos.filter((video) => video.category === 'horror');
      setTimeout(() => {
        if (videos) {
          this.communicationService.dataIsLoaded = true;
        }
      }, 3000);
    });
  }

  handleAddToWishlist(video: VideoModel) {
    this.databaseService.addToWishlist(video);
  }
}
