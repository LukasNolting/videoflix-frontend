import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '../../services/communication.service';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../../services/database.service';
import { VideoModel } from '../../models/video.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.scss',
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy, OnInit {
  private videoSubscription!: Subscription;
  private playVideosubscriptions: Subscription = new Subscription();
  private playPreviewSubscription: Subscription = new Subscription();
  player: any;
  currentVideoSource: string = '';
  videoQualities: any[] = [];
  playerOptions: any;
  quality: string = '1080p';
  constructor(
    public communicationService: CommunicationService,
    private dataBaseService: DatabaseService
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties are initialized.
   * Sets up the initial video state by getting a random video and subscribing
   * to video play and preview events from the communication service.
   */
  ngOnInit(): void {
    this.checkBandwidthAndSetQuality();

    this.playVideosubscriptions.add(
      this.communicationService.playVideo$.subscribe((path) => {
        if (path !== null) {
          const replacePath = path.replace(
            '.mp4',
            `_${this.quality}_hls/index.m3u8`
          );
          this.setVideoSource(path);
          this.updateVideoQualities();
        }
      })
    );
    this.playPreviewSubscription.add(
      this.communicationService.showPreview$.subscribe((path) => {
        if (path !== null && this.player) {
          this.setVideoSource(path);
          this.updateVideoQualities();
        }
      })
    );
  }

  setVideoSource(path: string) {
    const replacePath = path.replace('.mp4', `_${this.quality}_hls/index.m3u8`);
    this.currentVideoSource = `${environment.baseUrl}/media/${replacePath}`;
  }

  async checkBandwidthAndSetQuality() {
    await this.checkBandwidthAndSetVideoSource();
  }

  /**
   * Called after the view has been initialized. Sets up the video player by
   * initializing the videojs player with the given options and setting up
   * event listeners for the play button, full screen button, and quality select.
   * @returns void
   */
  ngAfterViewInit(): void {
    if (!this.communicationService.showVideoPlayerPopup) {
      this.initPreviewPlayer();
    } else {
      this.initPlayVideoPlayer();
    }
  }

  initPreviewPlayer() {
    this.player = (window as any).videojs('my-player', {
      controls: false,
      autoplay: true,
      muted: true,
      loop: true,
      fluid: true,
    });
    this.addQualityControlButton();
    this.getRandomVideo();
  }

  initPlayVideoPlayer() {
    const poster =
      environment.baseUrl +
      '/media/' +
      this.communicationService.currentVideoObj.thumbnail;
    this.player = (window as any).videojs('my-player', {
      controls: true,
      autoplay: false,
      muted: true,
      loop: false,
      fluid: true,
      poster: poster,
    });
    this.player.ready(() => {
      this.player.src({
        src: this.currentVideoSource,
        type: 'application/x-mpegURL',
      });
      const continuePlayTime = this.communicationService.continuePlayTime;
      if (continuePlayTime !== null) {
        this.setupEventListeners();
        this.player.currentTime(continuePlayTime);
      }
    });
    this.addQualityControlButton();
  }

  /**
   * Called when the component is destroyed. Unsubscribes from all subscriptions
   * created in the component to prevent memory leaks.
   * @returns void
   */
  ngOnDestroy(): void {
    if (this.playVideosubscriptions) {
      this.playVideosubscriptions.unsubscribe();
      this.player.dispose();
    }
    if (this.playPreviewSubscription) {
      this.playPreviewSubscription.unsubscribe();
      this.player.dispose();
    }
    if (this.videoSubscription) {
      this.videoSubscription.unsubscribe();
    }
    if (this.player) {
      this.communicationService.showVideoDescription = true;
      this.player.dispose();
    }
  }

  /**
   * Gets a random video from the database and sets the video source and video
   * object to the random video. This method is called in the constructor and
   * is used to set the initial video source in the component. The video source
   * is set by subscribing to the video subject in the database service and
   * getting a random video from the array of videos. The video object is also
   * set to the random video object.
   * @returns void
   */
  getRandomVideo() {
    this.videoSubscription = this.dataBaseService.videoSubject.subscribe(
      (videos: VideoModel[]) => {
        const randomIndex = Math.floor(Math.random() * videos.length);
        const randomVideoObject: VideoModel = videos[randomIndex];
        const randomVideo = videos[randomIndex]?.video_file;
        this.communicationService.currentVideoObj = randomVideoObject;
        this.currentVideoSource = `${
          environment.baseUrl
        }/media/${randomVideo.replace('.mp4', '')}_${
          this.quality
        }_hls/index.m3u8`;
        this.updateVideoQualities();
        if (this.player) {
          this.player.ready(() => {
            this.player.src({
              src: this.currentVideoSource,
              type: 'application/x-mpegURL',
            });
            this.player.play();
          });
        } else {
          console.warn();
          ('Player is not initialized yet');
        }
      }
    );
  }

  /**
   * Adds a button to the video player control bar to toggle the quality menu.
   * This method is called after the player has been initialized in ngAfterViewInit.
   * @returns void
   */
  addQualityControlButton(): void {
    this.updateVideoQualities();
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
    menu.innerHTML = '';
    this.videoQualities.forEach((quality) => {
      const option = document.createElement('div');
      option.className = 'quality-option pointer';
      option.innerText = quality.label;
      if (quality.label === this.quality) {
        option.className = 'quality-option pointer active';
      }
      option.onclick = () => this.onQualityChange(quality.src, quality.label);
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
      if (quality.label === this.quality) {
        option.classList.add('active');
      }
      option.onclick = () => this.onQualityChange(quality.src, quality.label);
      qualityMenu.appendChild(option);
    });
    this.player.controlBar.el().appendChild(qualityMenu);
  }

  /**
   * Called when the quality of the video is changed. Saves the current player time, sets the current video source to the selected quality, reloads the video, sets the player time back to the saved time, and plays the video.
   * @param selectedQualitySrc - The selected video quality.
   * @returns void
   */
  onQualityChange(selectedQualitySrc: string, selectedQualityLabel: string) {
    const currentTime = this.player.currentTime();
    this.quality = selectedQualityLabel;
    this.currentVideoSource = selectedQualitySrc;
    this.player.pause();
    this.player.src({
      src: this.currentVideoSource,
      type: 'application/x-mpegURL',
    });
    this.player.currentTime(currentTime);
    this.player.play();
    this.toggleQualityMenu();
  }

  /**
   * Update the video qualities dynamically based on the current video source.
   */
  updateVideoQualities() {
    const qualityLevels = ['240p', '360p', '480p', '720p', '1080p'];
    this.videoQualities = qualityLevels.map((quality) => ({
      label: quality,
      src: this.currentVideoSource.replace(this.quality, quality),
    }));
  }

  /**
   * Determines the appropriate video quality based on measured bandwidth and updates the video source accordingly.
   * It measures the bandwidth, checks against predefined thresholds to select a suitable video quality, and then
   * updates the current video source to the corresponding quality. If no valid video source is found, it defaults
   * to 1080p and logs a warning. Logs any errors encountered during bandwidth measurement.
   */
  async checkBandwidthAndSetVideoSource() {
    try {
      const bandwidth = await this.measureBandwidth();
      const qualities = ['1080p', '720p', '480p', '360p', '240p'];
      const thresholds = [5000, 2500, 1500, 1000, 0];
      const index = thresholds.findIndex((t) => bandwidth >= t);
      this.quality = qualities[index];
      if (!this.currentVideoSource) {
        this.quality = '1080p';
        console.warn('No valid video source found for', this.quality);
      } else {
        this.currentVideoSource =
          this.videoQualities.find((vq) => vq.label === this.quality)?.src ||
          '';
      }
    } catch (error) {
      console.warn('Bandwidth measurement error:', error);
    }
  }

  /**
   * Measures the bandwidth by loading a test image and calculating the load time.
   * @returns {Promise<number>} A promise that resolves with the measured bandwidth in kbps.
   */
  measureBandwidth(): Promise<number> {
    return new Promise((resolve, reject) => {
      const testImage = new Image();
      const testUrl = `${environment.baseUrl}/media/videos/xx_2.jpg`;
      const startTime = new Date().getTime();

      testImage.onload = () => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        const imageSize = 5176 * 8;
        const bandwidth = imageSize / duration;
        resolve(bandwidth);
      };

      testImage.onerror = () => {
        console.error('Error loading test image.');
        reject(null);
      };

      testImage.src = testUrl;
    });
  }

  /**
   * Sets up event listeners on the video player to save the current time when the video is paused and
   * to delete the video from the continue watching list when the video has ended.
   */
  setupEventListeners() {
    this.player.off('pause');
    this.player.on('pause', () => {
      if (!this.player.ended()) {
        this.saveCurrentTime();
      }
    });
    this.player.off('ended');
    this.player.on('ended', () => {
      this.dataBaseService.deleteVideoFromContinueWatching(
        this.communicationService.currentVideoObj.id
      );
      this.player.off('pause');
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
  }
}
