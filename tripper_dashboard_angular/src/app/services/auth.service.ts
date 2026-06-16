import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpService) {}

  signin(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('user/signin', credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('admin_token', res.token);
          localStorage.setItem('admin_user', JSON.stringify(res.user));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getUser() {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
}
