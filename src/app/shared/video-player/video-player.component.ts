import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy, OnInit {
  autoplay: boolean = false; // option:: autoplay (start playing video on load)
  controls: boolean = false; // option:: controls (show/hide controls)
  muted: boolean = true; // option:: muted
  loop: boolean = true; // option:: endlessloop
  currentPoster: string = ''; // option:: poster
  private playVideosubscriptions: Subscription = new Subscription();
  private playPreviewSubscription: Subscription = new Subscription();
  player: any;
  fullScreenSubscription: Subscription | undefined;
  currentVideoSource: string = '';
  videoQualities: any[] = [];
  playerOptions: any;
  constructor(public communicationService: CommunicationService) {}

  /**
   * Called when component is initialized.
   * Listens to two subjects to handle playing a video and showing a preview.
   * When a video should be played, the player is set to play the video and the controls are hidden.
   * When a preview should be shown, the player is set to play the corresponding video and the controls are hidden.
   */
  ngOnInit(): void {
    this.currentVideoSource =
      'http://127.0.0.1:8000/media/videos/TestVideo/79585-570048620_small.mp4'; // to-do get random video  + check bandwith and choose corresponding video resolution
    this.updateVideoQualities();
    this.playVideosubscriptions.add(
      this.communicationService.playVideo$.subscribe((playVideo) => {
        console.log('playVideoSubject', playVideo);
        if (playVideo === true) {
          this.player.controls(false);
          this.handlePlayVideo();
          this.communicationService.resetPlayVideo();
        }
      })
    );
    this.playPreviewSubscription.add(
      this.communicationService.showPreview$.subscribe((path) => {
        if (path !== null && this.player) {
          const baseURL = 'http://127.0.0.1:8000/'; //todo : use baseUrl from environment
          this.currentVideoSource = `${baseURL}media/${path}`;
          console.log('currentVideoSource', this.currentVideoSource);
          this.player.src({ type: 'video/mp4', src: this.currentVideoSource });
          this.player.load();
          this.player.play();
        }
      })
    );
  }

  /**
   * Called after the view has been initialized. Sets up the video player by
   * initializing the videojs player with the given options and setting up
   * event listeners for the play button, full screen button, and quality select.
   * @returns void
   */
  ngAfterViewInit(): void {
    const options = {
      controls: this.controls,
      autoplay: this.autoplay,
      muted: this.muted,
      loop: this.loop,
      fluid: true,
      poster: this.currentPoster,
    };

    console.log('playeroptions', options);
    this.player = (window as any).videojs('my-player', options);

    this.addQualityControlButton();

    this.player.ready(() => {
      this.player.play();
    });
    // todo : check if redundant
    this.fullScreenSubscription =
      this.communicationService.isFullScreenVisible$.subscribe((isVisible) => {
        if (isVisible) {
          this.goFullScreen();
        } else {
          this.exitFullScreen();
        }
      });
  }

  /**
   * Called when the component is destroyed. Unsubscribes from all subscriptions
   * created in the component to prevent memory leaks.
   * @returns void
   */
  ngOnDestroy(): void {
    if (this.fullScreenSubscription) {
      this.fullScreenSubscription.unsubscribe();
    }
    if (this.playVideosubscriptions) {
      this.playVideosubscriptions.unsubscribe();
    }
    if (this.playPreviewSubscription) {
      this.playPreviewSubscription.unsubscribe();
    }
  }
  /**
   * Adds a button to the video player control bar to toggle the quality menu.
   * This method is called after the player has been initialized in ngAfterViewInit.
   * @returns void
   */
  addQualityControlButton(): void {
    const qualityButton = document.createElement('button');
    qualityButton.className =
      'vjs-quality-control vjs-control vjs-button pointer';
    qualityButton.innerHTML = '<i class="fas fa-video"></i>';
    qualityButton.onclick = () => {
      this.toggleQualityMenu();
    };
    this.player.controlBar.el().appendChild(qualityButton);
  }

  /**
   * Toggles the visibility of the quality menu.
   * If the menu doesn't exist, it creates it.
   * If the menu exists, it toggles the visibility of the menu.
   * @returns void
   */
  toggleQualityMenu(): void {
    const menu = document.querySelector(
      '.vjs-quality-menu-custom'
    ) as HTMLElement;
    if (menu) {
      if (menu.classList.contains('vjs-hidden')) {
        menu.classList.remove('vjs-hidden');
        menu.classList.add('show');
      } else {
        menu.classList.remove('show');
        menu.classList.add('vjs-hidden');
      }
    } else {
      const qualityMenu = document.createElement('div');
      qualityMenu.className = 'vjs-quality-menu-custom';

      this.videoQualities.forEach((quality) => {
        const option = document.createElement('div');
        option.className = 'quality-option pointer';
        option.innerText = quality.label;
        option.onclick = () => this.onQualityChange(quality.src);
        qualityMenu.appendChild(option);
      });
      this.player.controlBar.el().appendChild(qualityMenu);
    }
  }

  /**
   * Called when the quality of the video is changed. Saves the current player time, sets the current video source to the selected quality, reloads the video, sets the player time back to the saved time, and plays the video.
   * @param selectedQualitySrc - The selected video quality.
   * @returns void
   */
  onQualityChange(selectedQualitySrc: string) {
    const currentTime = this.player.currentTime(); // saves current player time
    this.currentVideoSource = selectedQualitySrc; // sets current video source
    this.player.src({ type: 'video/mp4', src: this.currentVideoSource }); // updates video source
    this.player.load(); // reloads video
    this.player.ready(() => {
      this.player.currentTime(currentTime); // sets back to current time
      this.player.play(); // plays video
    });
    console.log('selectedQuality', selectedQualitySrc);
  }

  /**
   * Update the video qualities dynamically based on the current video source.
   */
  updateVideoQualities() {
    const baseVideoSource = this.currentVideoSource.replace('.mp4', '');
    this.videoQualities = [
      { label: '240p', src: `${baseVideoSource}_240p.mp4` },
      { label: '360p', src: `${baseVideoSource}_360p.mp4` },
      { label: '480p', src: `${baseVideoSource}_480p.mp4` },
      { label: '720p', src: `${baseVideoSource}_720p.mp4` },
      { label: '1080p', src: `${baseVideoSource}_1080p.mp4` },
    ];
    console.log('Updated video qualities:', this.videoQualities);
  }

  /**
   * Handles the play video functionality by setting the player to play, unmuted with a volume of 0.5, and with controls enabled. Sets the player time to 0 and requests full screen.
   * @returns void
   */
  handlePlayVideo() {
    console.log('handle play video triggert');
    this.player.play();
    this.player.muted(false);
    this.player.volume(0.5);
    this.player.controls(true);
    this.player.currentTime(0);
    this.player.requestFullscreen();
  }

  /**
   * Requests the player to go full screen.
   * @returns void
   */
  goFullScreen(): void {
    if (this.player) {
      this.player.requestFullscreen();
    }
  }

  /**
   * Exits the full screen mode if the player is currently in full screen.
   * @returns void
   */
  exitFullScreen(): void {
    if (this.player && this.player.isFullscreen()) {
      this.player.exitFullscreen();
    }
  }
}
