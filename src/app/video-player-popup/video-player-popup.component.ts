import { Component, Input } from '@angular/core';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { CommunicationService } from '../services/communication.service';
import { VideoModel } from '../models/video.model';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-video-player-popup',
  standalone: true,
  imports: [VideoPlayerComponent],
  templateUrl: './video-player-popup.component.html',
  styleUrl: './video-player-popup.component.scss',
})
export class VideoPlayerPopupComponent {
  constructor(
    public communicationService: CommunicationService,
    public databaseService: DatabaseService
  ) {}

  handleClosePopup() {
    this.communicationService.showVideoPlayerPopup = false;
    this.communicationService.togglePopup(false);
  }

  handleAddToWishlist(video: VideoModel, event: Event) {
    event.stopPropagation();
    this.databaseService.toggleFavourites(video);
  }
}
