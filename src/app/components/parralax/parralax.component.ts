import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  NgZone,
} from '@angular/core';

@Component({
  selector: 'app-parralax',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parralax.component.html',
  styleUrl: './parralax.component.scss',
})
export class ParralaxComponent implements AfterViewInit, OnDestroy {
  birdX = 0;
  birdY = 0;
  targetX = 0;
  targetY = 0;
  animationFrameId = 0;
  birdRatio = 0.5;
  backgroundRatio = 0.25;

  isBrowser: boolean;

  get birdTransform(): string {
    return `translate(calc(-50% + ${
      -this.birdX * this.birdRatio
    }px), calc(-50% + ${-this.birdY * this.birdRatio}px))`;
  }

  get backgroundTransform(): string {
    return `translate(calc(-50% + ${
      this.birdX * this.backgroundRatio
    }px), calc(-50% + ${this.birdY * this.backgroundRatio}px))`;
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isBrowser) return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const x = (event.clientX - centerX) * 0.1;
    const y = (event.clientY - centerY) * 0.1;

    this.targetX = x;
    this.targetY = y;
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }

  animate() {
    const lerp = (start: number, end: number, amt: number) =>
      start + (end - start) * amt;

    this.birdX = lerp(this.birdX, this.targetX, 0.05);
    this.birdY = lerp(this.birdY, this.targetY, 0.05);

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
