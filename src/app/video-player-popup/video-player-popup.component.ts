import { Component, Input } from '@angular/core';
import { VideoPlayerComponent } from '../shared/video-player/video-player.component';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-video-player-popup',
  standalone: true,
  imports: [VideoPlayerComponent],
  templateUrl: './video-player-popup.component.html',
  styleUrl: './video-player-popup.component.scss',
})
export class VideoPlayerPopupComponent {
  showInfoOverlay: boolean = true;
  @Input() favoriteVideoIds: number[] = [];

  constructor(public communicationService: CommunicationService) {}

  handleClosePopup() {
    this.communicationService.showVideoPlayerPopup = false;
  }

  toggleDescription() {
    this.showInfoOverlay = !this.showInfoOverlay;
  }
}
