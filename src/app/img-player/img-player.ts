import {Component, ViewChild, ElementRef, AfterViewChecked, OnDestroy} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-img-player',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './img-player.html',
  styleUrls: ['./img-player.css']
})
export class ImgPlayerComponent {
  images: string[] = [];
  currentIndex = 0;
  intervalId: number | null = null;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input?.files;
    this.images = [];

    if (files) {
      for (let file of files) {
        if (file.type === 'image/jpeg') {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === 'string') {
              this.images.push(e.target.result);
            }
            if (this.images.length === 1) {
              this.startSlideshow();
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  startSlideshow() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 10000); // Change slide every 10 seconds
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  $onDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
