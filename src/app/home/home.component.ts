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
  public currentVideoObj: VideoModel[] = [];
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
      this.newVideos = videos.filter((video) => video.category === 'new');
    });
  }

  handlePlayVideo(video: VideoModel, path: string) {
    console.log('play video id', path);
    this.communicationService.showPreview(path);
    this.currentVideoObj = [video]; //todo : needs to get initial video data from database
    console.log('currentVideoObj', this.currentVideoObj);
  }
}
