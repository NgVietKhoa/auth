import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  credentials = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    // Kiểm tra password và confirmPassword có khớp nhau không
    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (
      !this.credentials.username ||
      !this.credentials.email ||
      !this.credentials.password
    ) {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin bắt buộc';
      return;
    }

    this.isLoading = true;

    // Gọi service để đăng ký
    this.authService
      .register(
        this.credentials.username,
        this.credentials.email,
        this.credentials.password
      )
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Đăng ký thành công! Vui lòng đăng nhập.';

          // Reset form sau khi đăng ký thành công
          this.credentials = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
          };

          // Chuyển đến trang đăng nhập sau 2 giây
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;

          // Xử lý nhiều trường hợp khác nhau của cấu trúc lỗi
          if (typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage =
              'Đăng ký không thành công. Vui lòng thử lại sau.';
          }

          // Dịch thông báo lỗi sang tiếng Việt nếu là lỗi phổ biến
          if (this.errorMessage === 'Username or email already exists') {
            this.errorMessage = 'Tên đăng nhập hoặc email đã tồn tại';
          }

          console.error('Register error:', error);
        },
      });
  }
}
