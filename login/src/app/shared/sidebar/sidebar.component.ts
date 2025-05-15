import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

interface SectionState {
  products: boolean;
  interns: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  sidebarOpen = true;
  isUserMenuOpen = false;
  expandedSections: SectionState = {
    products: true,
    interns: true,
  };

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedState = localStorage.getItem('sidebarOpen');
      if (savedState !== null) {
        this.sidebarOpen = savedState === 'true';
      } else {
        this.sidebarOpen = window.innerWidth > 768;
      }

      window.addEventListener('resize', this.checkWindowSize.bind(this));
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (isPlatformBrowser(this.platformId) && this.isUserMenuOpen) {
      const target = event.target as HTMLElement;
      const clickedInside = this.elementRef.nativeElement.contains(target);
      if (!clickedInside) {
        this.isUserMenuOpen = false;
      }
    }
  }

  checkWindowSize() {
    if (window.innerWidth <= 768 && this.sidebarOpen) {
      this.sidebarOpen = false;
      localStorage.setItem('sidebarOpen', 'false');
    }
  }

  toggleSidebar(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarOpen = !this.sidebarOpen;
      localStorage.setItem('sidebarOpen', this.sidebarOpen.toString());
    }
  }

  toggleSection(section: keyof SectionState): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  logout(): void {
    this.authService.logout();
  }

  getUserInitial(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.currentUserValue;
      if (user && user.username) {
        return user.username.charAt(0).toUpperCase();
      }
    }
    return 'U';
  }

  getUserName(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.currentUserValue;
      if (user && user.username) {
        return user.username;
      }
    }
    return 'Người dùng';
  }

  userMenuToggle(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}