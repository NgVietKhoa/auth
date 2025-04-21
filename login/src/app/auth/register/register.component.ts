import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  credentials = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  errorMessage: string | null = null;

  onSubmit() {
    this.errorMessage = null;

    // Kiểm tra password và confirmPassword có khớp nhau không
    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Kiểm tra các trường bắt buộc
    if (!this.credentials.username || !this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    // Logic xử lý đăng ký (gửi dữ liệu đến backend hoặc console.log để kiểm tra)
    console.log('Register credentials:', this.credentials);

    // Reset form sau khi đăng ký thành công (tùy chọn)
    this.credentials = {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    };
  }
}