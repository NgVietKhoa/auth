import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  sidebarOpen = true;

  constructor(
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      this.sidebarOpen = false;
    }
  }

  toggleSidebar(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.sidebarOpen = !this.sidebarOpen;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // Lấy chữ cái đầu tiên của tên người dùng để hiển thị trong icon
  getUserInitial(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.currentUserValue;
      if (user && user.username) {
        return user.username.charAt(0).toUpperCase();
      }
    }
    return 'U'; // Mặc định nếu không có username hoặc trên server
  }

  // Lấy tên đầy đủ của người dùng
  getUserName(): string {
    if (isPlatformBrowser(this.platformId)) {
      const user = this.authService.currentUserValue;
      if (user && user.username) {
        return user.username;
      }
    }
    return 'Người dùng'; // Mặc định nếu không có username hoặc trên server
  }
}