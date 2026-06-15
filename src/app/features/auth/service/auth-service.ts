import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse } from '../model/auth-response';
import { LoginRequest } from '../model/login-request';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  url: string = 'http://localhost:8080/auth'
  
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, request)
            .pipe(
              tap(
                response => {
                  localStorage.setItem(
                    'access_token',
                    response.access_token
                  );
                  localStorage.setItem(
                    'refresh_token',
                    response.refresh_token
                  );
                }
              )
            );
  }

  logout(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

  }
}
