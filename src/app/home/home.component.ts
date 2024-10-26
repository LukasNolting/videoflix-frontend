import { CarouselComponent } from 'ngx-carousel-ease';
import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CommunicationService } from '../services/communication.service';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { DatabaseService } from '../services/database.service';
import { VideoModel } from '../models/video.model';
import { ContinueWatching } from '../models/continue-watching';
import { environment } from '../../environments/environment';
import { VideoPlayerPopupComponent } from '../shared/video-player-popup/video-player-popup.component';

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
    VideoPlayerPopupComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewChecked {
  public newVideos: VideoModel[] = [];
  public actionVideos: VideoModel[] = [];
  public documentaryVideos: VideoModel[] = [];
  public animalVideos: VideoModel[] = [];
  public horrorVideos: VideoModel[] = [];
  public favoriteVideos: VideoModel[] = [];
  public continueWatchingVideos: ContinueWatching[] = [];
  public baseUrl = `${environment.baseUrl}/media/`;
  public favoriteVideoIds: number[] = [];

  constructor(
    private router: Router,
    public communicationService: CommunicationService,
    public databaseService: DatabaseService
  ) {
    if (this.router.url === '/home') {
      this.communicationService.isLoggedIn = true;
    }
  }

  /**
   * Initializes the component by loading videos, favorite videos, and continue watching videos.
   */
  ngOnInit(): void {
    this.loadVideos();
    this.loadFavoriteVideos();
    this.loadContinueWatchingVideos();
  }
  /**
   * Lifecycle hook, after the component's view has been fully initialized.
   * Used to detect when the carousels have finished rendering, and set the
   * respective flags on the database service to indicate that they have
   * finished rendering.
   */
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

  /**
   * Loads videos from the database and sets properties for new, action, documentary,
   * animal, and horror videos based on the retrieved data.
   * Calls filterAndSortNewVideos and filterAndSortByCategory functions to process videos.
   */
  private loadVideos(): void {
    this.databaseService.loadVideos();
    this.databaseService.getVideos().subscribe((videos) => {
      this.newVideos = this.filterAndSortNewVideos(
        videos,
        '2024-09-12T09:12:11Z'
      );
      this.actionVideos = this.filterAndSortByCategory(videos, 'action');
      this.documentaryVideos = this.filterAndSortByCategory(
        videos,
        'documentary'
      );
      this.animalVideos = this.filterAndSortByCategory(videos, 'animals');
      this.horrorVideos = this.filterAndSortByCategory(videos, 'horror');
      this.setDataIsLoaded(videos);
    });
  }

  /**
   * Filters and sorts the given videos based on a comparison date.
   *
   * @param videos Array of VideoModel objects to filter and sort.
   * @param date The comparison date in string format.
   * @returns An array of VideoModel objects filtered and sorted based on the comparison date.
   */
  private filterAndSortNewVideos(
    videos: VideoModel[],
    date: string
  ): VideoModel[] {
    const comparisonDate = new Date(date);
    return videos
      .filter((video) => new Date(video.created_at) > comparisonDate)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  /**
   * Filters and sorts the given videos based on a category.
   *
   * @param videos Array of VideoModel objects to filter and sort.
   * @param category The category to filter videos by.
   * @returns An array of VideoModel objects filtered and sorted based on the category.
   */
  private filterAndSortByCategory(
    videos: VideoModel[],
    category: string
  ): VideoModel[] {
    return videos
      .filter((video) => video.category === category)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  /**
   * Loads the favorite videos of the user and sets the favoriteVideos and
   * favoriteVideoIds properties accordingly.
   */
  private loadFavoriteVideos(): void {
    this.databaseService.loadFavoriteVideos();
    this.databaseService.getFavoriteVideos().subscribe((favoriteVideos) => {
      this.favoriteVideos = favoriteVideos;
      this.favoriteVideoIds = favoriteVideos.map((video) => video.id);
    });
  }

  /**
   * Loads the videos that the user has saved to continue watching and sets the
   * continueWatchingVideos property accordingly.
   */
  private loadContinueWatchingVideos(): void {
    this.databaseService.loadContinueWatchingVideos();
    this.databaseService
      .getContinueWatchingVideos()
      .subscribe((continueWatchingVideos) => {
        this.continueWatchingVideos = continueWatchingVideos;
      });
  }

  /**
   * Sets the dataIsLoaded property of the CommunicationService to true after a
   * delay of 3 seconds if the given videos array is not empty. This is used to
   * prevent the content from being displayed before the carousels have finished
   * loading.
   * @param videos An array of VideoModel objects retrieved from the database.
   */
  private setDataIsLoaded(videos: VideoModel[]): void {
    this.communicationService.dataIsLoaded = false;
    setTimeout(() => {
      if (videos.length > 0) {
        this.communicationService.dataIsLoaded = true;
      }
    }, 3000);
  }

  /**
   * Handles the event when the user clicks on a heart icon in one of the
   * carousels. Toggles the video in the user's favourites list and reloads the
   * favourite videos.
   *
   * @param video The video object that the user clicked on.
   * @param event The click event.
   */
  handleAddToWishlist(video: VideoModel, event: Event) {
    event.stopPropagation();
    this.databaseService.toggleFavourites(video);
  }
}
