import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id?: string;
  username: string;
  email?: string;
  token?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://apiecoit.onrender.com/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object // Thêm PLATFORM_ID
  ) {
    // Kiểm tra nếu đang chạy trong trình duyệt
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (error) {
          console.error('Lỗi khi phân tích dữ liệu người dùng từ localStorage:', error);
          localStorage.removeItem('currentUser'); // Xóa dữ liệu không hợp lệ
        }
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token && isPlatformBrowser(this.platformId)) {
            // Chỉ lưu vào localStorage nếu chạy trong trình duyệt
            const user: User = {
              username,
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password
    }).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    // Thực hiện HTTP request để logout
    this.http.get<any>(`${this.apiUrl}/logout`).pipe(
      catchError(error => {
        console.error('Logout API error:', error);
        return of(null); // Bỏ qua lỗi từ API, vẫn tiếp tục logout ở phía client
      })
    ).subscribe(() => {
      // Luôn xóa dữ liệu người dùng ở phía client, bất kể API có thành công hay không
      this.clearUserData();
    });
  }

  // Phương thức xóa dữ liệu người dùng và điều hướng
  private clearUserData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Xử lý lỗi HTTP chung
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Lỗi: ${error.error.message}`;
    } else if (error.status === 0) {
      errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else if (error.status === 401) {
      errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
    } else if (error.status === 400) {
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      }
      
      if (errorMessage === 'Username or email already exists') {
        errorMessage = 'Tên đăng nhập hoặc email đã tồn tại';
      }
    } else if (error.status === 404) {
      errorMessage = 'Không tìm thấy API yêu cầu';
    } else if (error.status === 500) {
      errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
    } else if (error.error && typeof error.error === 'object') {
      const serverError = error.error;
      if (serverError.message) {
        errorMessage = serverError.message;
      }
    }

    if (error.name === 'HttpErrorResponse' && error.message.includes('Http failure during parsing')) {
      errorMessage = 'Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại sau.';
      console.warn('Lỗi phân tích cú pháp JSON từ phản hồi API:', error);
    }
    
    return throwError(() => ({
      error: errorMessage,
      originalError: error
    }));
  }
}