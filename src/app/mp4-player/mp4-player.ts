import { Component, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mp4-player',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mp4-player.html',
  styleUrls: ['./mp4-player.css']
})
export class Mp4PlayerComponent implements AfterViewChecked, OnDestroy {
  videoUrl: string | null = null;
  errorMessage: string | null = null;
  videoFiles: File[] = [];
  currentVideoIndex = -1;
  private shouldPlayVideo = false;
  private isEventListenerAttached = false;

  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Filter only MP4 files
      const mp4Files = Array.from(input.files).filter(file => file.type === 'video/mp4');

      if (mp4Files.length > 0) {
        this.errorMessage = null;
        this.videoFiles = mp4Files;
        this.currentVideoIndex = 0;
        this.isEventListenerAttached = false; // Reset event listener flag
        this.loadVideo(this.currentVideoIndex);
      } else {
        this.errorMessage = 'Please select valid MP4 files.';
        this.videoUrl = null;
        this.videoFiles = [];
        this.currentVideoIndex = -1;
        this.shouldPlayVideo = false;
      }
    }
  }

  private loadVideo(index: number): void {
    if (index >= 0 && index < this.videoFiles.length) {
      // Clean up previous video URL
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl);
      }

      this.videoUrl = URL.createObjectURL(this.videoFiles[index]);
      this.shouldPlayVideo = true;
      this.isEventListenerAttached = false; // Reset for new video
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldPlayVideo && this.videoPlayer && !this.isEventListenerAttached) {
      const video = this.videoPlayer.nativeElement;

      // Set up event listeners
      const onCanPlay = () => {
        video.play().catch(error => {
          console.log('Autoplay failed:', error);
        });
        video.removeEventListener('canplay', onCanPlay);
      };

      const onEnded = () => {
        this.playNextVideo();
        video.removeEventListener('ended', onEnded);
      };

      video.addEventListener('canplay', onCanPlay);
      video.addEventListener('ended', onEnded);

      this.isEventListenerAttached = true;
      this.shouldPlayVideo = false;
    }
  }

  private playNextVideo(): void {
    if (this.currentVideoIndex < this.videoFiles.length - 1) {
      this.currentVideoIndex++;
      this.loadVideo(this.currentVideoIndex);
    } else {
      console.log('All videos have finished playing');
    }
  }

  ngOnDestroy(): void {
    if (this.videoUrl) {
      URL.revokeObjectURL(this.videoUrl);
    }
  }
}
