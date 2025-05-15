import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('mainElement', { static: true }) mainElement!: ElementRef;
  isLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = 'https://bkecoit.ecoit.com.vn/sliders/image/1689939341336_ecoit.png';
              img.onload = () => {
                this.isLoaded = true;
                this.mainElement.nativeElement.classList.add('loaded');
              };
              img.onerror = () => {
                this.isLoaded = true;
                this.mainElement.nativeElement.classList.add('loaded');
              };
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(this.mainElement.nativeElement);
    }
  }
}