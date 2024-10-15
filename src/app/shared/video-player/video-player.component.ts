import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { VideoModel } from '../../models/video.model';

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
  constructor(
    public communicationService: CommunicationService,
    private dataBaseService: DatabaseService
  ) {}

  /**
   * Called when component is initialized.
   * Listens to two subjects to handle playing a video and showing a preview.
   * When a video should be played, the player is set to play the video and the controls are hidden.
   * When a preview should be shown, the player is set to play the corresponding video and the controls are hidden.
   */
  ngOnInit(): void {
    this.getRandomVideo();
    this.playVideosubscriptions.add(
      this.communicationService.playVideo$.subscribe((playVideo) => {
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
          this.updateVideoQualities();
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

  getRandomVideo() {
    this.dataBaseService.videoSubject.subscribe((videos: VideoModel[]) => {
      const randomIndex = Math.floor(Math.random() * videos.length);
      const randomVideoObject: VideoModel = videos[randomIndex];
      const randomVideo = videos[randomIndex]?.video_file;
      this.communicationService.currentVideoObj = randomVideoObject;
      this.currentVideoSource = `http://127.0.0.1:8000/media/${randomVideo}`;
      this.updateVideoQualities();
    });
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
   * Toggles the visibility of the quality menu. If the menu already exists, its
   * visibility is toggled by adding or removing the classes 'vjs-hidden' and
   * 'show', and its options are updated. If the menu does not exist, it is
   * created.
   * @returns void
   */
  toggleQualityMenu(): void {
    const menu = document.querySelector(
      '.vjs-quality-menu-custom'
    ) as HTMLElement;

    if (menu) {
      this.toggleMenuVisibility(menu);
      this.updateMenuOptions(menu);
    } else {
      this.createQualityMenu();
    }
  }
  /**
   * Toggles the visibility of the given quality menu by adding or removing
   * the classes 'vjs-hidden' and 'show'.
   * @param menu The HTMLElement of the quality menu.
   * @returns void
   */
  toggleMenuVisibility(menu: HTMLElement): void {
    if (menu.classList.contains('vjs-hidden')) {
      menu.classList.remove('vjs-hidden');
      menu.classList.add('show');
    } else {
      menu.classList.remove('show');
      menu.classList.add('vjs-hidden');
    }
  }

  /**
   * Updates the options of the given quality menu.
   * @param menu The HTMLElement of the quality menu.
   * @returns void
   */
  updateMenuOptions(menu: HTMLElement): void {
    menu.innerHTML = ''; // Leert vorhandene Optionen
    this.videoQualities.forEach((quality) => {
      const option = document.createElement('div');
      option.className = 'quality-option pointer';
      option.innerText = quality.label;
      option.onclick = () => this.onQualityChange(quality.src);
      menu.appendChild(option);
    });
  }
  /**
   * Creates a custom quality menu for the video player. The menu is created by
   * creating a div element with the class 'vjs-quality-menu-custom' and
   * appending it to the player control bar. The menu is populated with options
   * representing the available video qualities. Each option is a div element with
   * the class 'quality-option' and the text content of the quality label. When an
   * option is clicked, the onQualityChange method is called with the src of the
   * selected quality.
   */
  createQualityMenu(): void {
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
    this.toggleQualityMenu();
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
    this.checkBandwidthAndSetVideoSource();
  }

  // todo : refactor / outsource / shorten
  /**
   * Measures the current bandwidth and sets the video source based on the available quality.
   * @async
   * @returns {Promise<void>} A promise that resolves when the video source is set.
   * @throws {Error} Throws an error if bandwidth measurement fails.
   */
  async checkBandwidthAndSetVideoSource() {
    try {
      const bandwidth = await this.measureBandwidth();
      let selectedQualitySrc = '';
      if (bandwidth >= 5000) {
        selectedQualitySrc = this.videoQualities.find(
          (vq) => vq.label === '1080p'
        )?.src;
      } else if (bandwidth >= 2500) {
        selectedQualitySrc = this.videoQualities.find(
          (vq) => vq.label === '720p'
        )?.src;
      } else if (bandwidth >= 1500) {
        selectedQualitySrc = this.videoQualities.find(
          (vq) => vq.label === '480p'
        )?.src;
      } else if (bandwidth >= 1000) {
        selectedQualitySrc = this.videoQualities.find(
          (vq) => vq.label === '360p'
        )?.src;
      } else {
        selectedQualitySrc = this.videoQualities.find(
          (vq) => vq.label === '240p'
        )?.src;
      }

      if (selectedQualitySrc) {
        this.currentVideoSource = selectedQualitySrc;
        console.log(
          'Current video source based on bandwidth:',
          this.currentVideoSource
        );
      } else {
        console.error('No suitable video quality found.');
      }
    } catch (error) {
      console.error('Bandwidth measurement error:', error);
    }
  }

  /**
   * Measures the bandwidth by loading a test image and calculating the load time.
   * @returns {Promise<number>} A promise that resolves with the measured bandwidth in kbps.
   */
  measureBandwidth(): Promise<number> {
    return new Promise((resolve, reject) => {
      const testImage = new Image();
      const testUrl = 'http://127.0.0.1:8000/media/videos/xx_2.jpg';
      const startTime = new Date().getTime();

      testImage.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const imageSize = 5176 * 8;
        const bandwidth = imageSize / duration;
        resolve(bandwidth);
        console.log('Bandwidth:', bandwidth);
      };

      testImage.onerror = () => {
        console.error('Error loading test image.');
        reject(null);
      };

      testImage.src = testUrl;
    });
  }

  /**
   * Handles the video playback by setting up the player and starting the video.
   */
  handlePlayVideo() {
    this.setupPlayer();
    this.player.play();
    this.setupEventListeners();
  }

  /**
   * Sets up the video player with the appropriate settings.
   */
  setupPlayer() {
    if (this.communicationService.continuePlayTime !== null) {
      this.setPlayerForContinueWatching();
    } else {
      this.player.currentTime(0);
    }
    this.player.muted(false);
    this.player.volume(0.5);
    this.player.controls(true);
    this.player.requestFullscreen();
    this.player.loop(false);
  }

  /**
   * Sets up event listeners for the video player.
   */
  setupEventListeners() {
    this.player.off('pause');
    this.player.on('pause', () => this.saveCurrentTime());

    this.player.off('ended');
    this.player.on('ended', () => {
      console.log('Video ended');
      // TODO: delete from continue watching
    });
  }

  /**
   * Saves the current time of the video when it is paused.
   */
  saveCurrentTime() {
    const currentTime = this.player.currentTime();
    this.dataBaseService.saveVideoToContinueWatching(
      this.communicationService.currentVideoObj,
      currentTime
    );
    console.log('Video paused at time: ', currentTime);
  }

  /**
   * Sets the video player to continue watching from the last saved time.
   */
  setPlayerForContinueWatching() {
    const baseURL = 'http://127.0.0.1:8000/'; // TODO: use baseUrl from environment
    this.currentVideoSource = `${baseURL}media/${this.communicationService.currentVideoObj?.video_file}`;
    this.player.src({ type: 'video/mp4', src: this.currentVideoSource });
    const continuePlayTime = this.communicationService.continuePlayTime;
    if (continuePlayTime !== null) {
      this.player.currentTime(continuePlayTime);
      console.log(`Resuming video at time: ${continuePlayTime}`);
    }
  }

  // todo : check if redundant

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
