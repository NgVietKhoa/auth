import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError, of } from 'rxjs';
import { Router } from '@angular/router';

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
  
  constructor(private http: HttpClient, private router: Router) {
    // Kiểm tra nếu có thông tin người dùng trong localStorage khi khởi động
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

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Lưu thông tin người dùng vào localStorage
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

  logout(): Observable<any> {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!this.isLoggedIn()) {
      // Nếu không đăng nhập, không cần gọi API, chỉ cần xử lý phía client
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
      return of({ success: true });
    }

    return this.http.get<any>(`${this.apiUrl}/logout`)
      .pipe(
        tap(() => {
          // Xóa thông tin người dùng khỏi localStorage
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        }),
        catchError(error => {
          // Ngay cả khi logout thất bại, vẫn xóa dữ liệu người dùng ở client
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
          return this.handleError(error);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  // Xử lý lỗi HTTP chung
  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    
    let errorMessage = 'Đã xảy ra lỗi không xác định';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else if (error.status === 0) {
      // Lỗi kết nối
      errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else if (error.status === 401) {
      // Lỗi xác thực
      errorMessage = 'Tên đăng nhập hoặc mật khẩu không đúng';
    } else if (error.status === 400) {
      // Lỗi đầu vào
      if (typeof error.error === 'string') {
        // Nếu error.error là string, sử dụng trực tiếp
        errorMessage = error.error;
      } else if (error.error?.message) {
        // Nếu error.error có trường message
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
      }
      
      // Dịch các thông báo lỗi phổ biến sang tiếng Việt
      if (errorMessage === 'Username or email already exists') {
        errorMessage = 'Tên đăng nhập hoặc email đã tồn tại';
      }
    } else if (error.status === 404) {
      errorMessage = 'Không tìm thấy API yêu cầu';
    } else if (error.status === 500) {
      errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau.';
    } else if (error.error && typeof error.error === 'object') {
      // Trường hợp server trả về một đối tượng lỗi
      const serverError = error.error;
      if (serverError.message) {
        errorMessage = serverError.message;
      }
    }

    // Xử lý lỗi phân tích cú pháp
    if (error.name === 'HttpErrorResponse' && error.message.includes('Http failure during parsing')) {
      errorMessage = 'Máy chủ trả về dữ liệu không hợp lệ. Vui lòng thử lại sau.';
      console.warn('Lỗi phân tích cú pháp JSON từ phản hồi API:', error);
    }
    
    // Trả về Observable lỗi với thông báo đã được xử lý
    return throwError(() => ({
      error: errorMessage,
      originalError: error
    }));
  }
}