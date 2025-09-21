import { Component, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mp3-player',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './mp3-player.html',
  styleUrls: ['./mp3-player.css']
})
export class Mp3PlayerComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef<HTMLAudioElement>;
  audioSrc: string | null = null;
  volume: number = 1;
  audioFiles: File[] = [];
  currentAudioIndex = -1;
  private shouldPlayAudio = false;
  private isEventListenerAttached = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Filter only MP3 files
      const mp3Files = Array.from(input.files).filter(file => file.name.toLowerCase().endsWith('.mp3'));

      if (mp3Files.length > 0) {
        this.audioFiles = mp3Files;
        this.currentAudioIndex = 0;
        this.isEventListenerAttached = false; // Reset event listener flag
        this.loadAudio(this.currentAudioIndex);
      } else {
        this.audioSrc = null;
        this.audioFiles = [];
        this.currentAudioIndex = -1;
        this.shouldPlayAudio = false;
      }
    }
  }

  private loadAudio(index: number): void {
    if (index >= 0 && index < this.audioFiles.length) {
      // Clean up previous audio URL
      if (this.audioSrc) {
        URL.revokeObjectURL(this.audioSrc);
      }

      this.audioSrc = URL.createObjectURL(this.audioFiles[index]);
      this.shouldPlayAudio = true;
      this.isEventListenerAttached = false; // Reset for new audio
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldPlayAudio && this.audioPlayer && !this.isEventListenerAttached) {
      const audio = this.audioPlayer.nativeElement;

      // Set up event listeners
      const onCanPlay = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.log('Autoplay failed:', error);
        }
        audio.removeEventListener('loadeddata', onCanPlay);
      };

      const onEnded = () => {
        this.playNextAudio();
        audio.removeEventListener('ended', onEnded);
      };

      audio.addEventListener('loadeddata', onCanPlay);
      audio.addEventListener('ended', onEnded);

      this.isEventListenerAttached = true;
      this.shouldPlayAudio = false;
    }
  }

  private playNextAudio(): void {
    if (this.currentAudioIndex < this.audioFiles.length - 1) {
      this.currentAudioIndex++;
      this.loadAudio(this.currentAudioIndex);
    } else {
      console.log('All audio files have finished playing');
    }
  }

  play(): void {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.play().catch(error => {
        console.log('Play failed:', error);
      });
    }
  }

  pause(): void {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.pause();
    }
  }

  setVolume(): void {
    if (this.audioPlayer) {
      this.audioPlayer.nativeElement.volume = this.volume;
    }
  }

  ngOnDestroy(): void {
    if (this.audioSrc) {
      URL.revokeObjectURL(this.audioSrc);
    }
  }
}