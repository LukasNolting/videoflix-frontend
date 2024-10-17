import { VideoModel } from './video.model';

export class ContinueWatching {
  timestamp: number;
  video: VideoModel;

  constructor(timestamp: number, video: VideoModel) {
    this.timestamp = timestamp;
    this.video = video;
  }
}
