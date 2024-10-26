import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoPlayerPopupComponent } from './video-player-popup.component';

describe('VideoPlayerPopupComponent', () => {
  let component: VideoPlayerPopupComponent;
  let fixture: ComponentFixture<VideoPlayerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoPlayerPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoPlayerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
