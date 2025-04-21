import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  onSubmit() {
    if (this.credentials.username && this.credentials.password) {
      console.log('Login attempt:', { username: this.credentials.username, password: this.credentials.password });
    } else {
      console.log('Please fill in all fields');
    }
  }
}