import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-parralax',
  imports: [CommonModule],
  templateUrl: './parralax.component.html',
  styleUrl: './parralax.component.scss',
})
export class ParralaxComponent implements OnDestroy {
  birdX: number = 0;
  birdY: number = 0;
  targetX: number = 0;
  targetY: number = 0;
  animationFrameId: number = 0;
  birdRatio = 1;
  backgroundRatio = 0.2;

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
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    this.targetX = (event.clientX - centerX) * 0.1;
    this.targetY = (event.clientY - centerY) * 0.1;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.animate();
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
    if (isPlatformBrowser(this.platformId)) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
