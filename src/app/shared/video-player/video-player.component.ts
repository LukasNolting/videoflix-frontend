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
  controls: boolean = true; // option:: controls (show/hide controls)
  muted: boolean = true; // option:: muted
  loop: boolean = true; // option:: endlessloop
  currentPoster: string = '//vjs.zencdn.net/v/oceans.png'; // option:: poster
  private playVideosubscriptions: Subscription = new Subscription();
  private playPreviewSubscription: Subscription = new Subscription();
  player: any;
  fullScreenSubscription: Subscription | undefined;
  currentVideoSource: string = '';
  videoQualities = [
    { label: '360p', src: '//vjs.zencdn.net/v/oceans.mp4' },
    { label: '480p', src: '//vjs.zencdn.net/v/oceans.mp4' },
    { label: '720p', src: '//vjs.zencdn.net/v/oceans.mp4' },
    { label: '1080p', src: '//vjs.zencdn.net/v/oceans.mp4' },
  ];
  playerOptions: any;
  constructor(public communicationService: CommunicationService) {
    this.currentVideoSource = this.videoQualities[1].src;
  }

  ngOnInit(): void {
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
      this.communicationService.showPreview$.subscribe((id) => {
        console.log('showPreview', id);
        if (id > 0 && this.player) {
          const newVideoSource = this.getVideoSourceById(id);
          console.log('Changing video source to:', newVideoSource);
          this.currentVideoSource = newVideoSource;
          this.player.src({ type: 'video/mp4', src: this.currentVideoSource });
          this.player.load();
          this.player.play();
        }
      })
    );
  }
  getVideoSourceById(id: number): string {
    switch (id) {
      case 1:
        return '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
      case 2:
        return '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      case 3:
        return '//commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4';
      default:
        return this.currentVideoSource;
    }
  }
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

    this.fullScreenSubscription =
      this.communicationService.isFullScreenVisible$.subscribe((isVisible) => {
        if (isVisible) {
          this.goFullScreen();
        } else {
          this.exitFullScreen();
        }
      });
  }

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

  onQualityChange(selectedQuality: string) {
    const currentTime = this.player.currentTime(); // saves current player time
    this.currentVideoSource = selectedQuality; // sets current video source
    this.player.src({ type: 'video/mp4', src: this.currentVideoSource }); // updates video source
    this.player.load(); // reloads video
    this.player.ready(() => {
      this.player.currentTime(currentTime); // sets back to current time
      this.player.play(); // plays video
    });
    console.log('selectedQuality', selectedQuality);
  }

  handlePlayVideo() {
    console.log('handle play video triggert');
    this.player.play();
    this.player.muted(false);
    this.player.volume(0.5);
    this.player.controls(true);
    this.player.currentTime(0);
    this.player.requestFullscreen();
  }

  goFullScreen(): void {
    if (this.player) {
      this.player.requestFullscreen();
    }
  }

  exitFullScreen(): void {
    if (this.player && this.player.isFullscreen()) {
      this.player.exitFullscreen();
    }
  }
}
