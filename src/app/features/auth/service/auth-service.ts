import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../model/login-request';
import { RegistroRequest } from '../model/registro-request';
import { AuthResponse } from '../model/auth-response';
import { environment } from '../../../../environments/environment';

interface JwtClaims {
  sub: string;   // correoInstitucional
  jti: string;   // idUsuario
  nombre: string;
  rol: string;   // ej. "ADMIN" o "USUARIO" (sin prefijo ROLE_)
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, request).pipe(
      tap((response) => {
        this.saveTokens(response);
        this.loggedIn.next(true);
      })
    );
  }

  registrar(request: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/registro`, request).pipe(
      tap((response) => {
        // El backend ya devuelve tokens en el registro -> queda logueado automáticamente
        this.saveTokens(response);
        this.loggedIn.next(true);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${refreshToken}`);

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {}, { headers }).pipe(
      tap((response) => {
        this.saveTokens(response);
      })
    );
  }

  logout(): Observable<any> {
    const userId = this.getUserIdFromToken();
    return this.http.put(`${this.API_URL}/${userId}`, {}, { responseType: 'text' }).pipe(
      tap(() => this.clearSession())
    );
  }

  // --- Manejo de Tokens ---
  private saveTokens(response: AuthResponse) {
    // FIX: antes se guardaba con clave "access_token"/"refresh_token" leyendo
    // "response.access_token" (undefined). Ahora coincide con el DTO real del backend.
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private hasToken(): boolean {
    return !!this.getAccessToken();
  }

  clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // --- JWT y Roles ---
  getDecodedToken(): JwtClaims | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode<JwtClaims>(token);
    } catch {
      return null;
    }
  }

  getUserIdFromToken(): string | null {
    return this.getDecodedToken()?.jti ?? null;
  }

  // FIX: comparación tolerante al prefijo. Acepta 'ADMIN' o 'ROLE_ADMIN'
  // indistintamente, para no depender de cómo esté guardado el enum en BD.
  hasRole(expectedRole: string): boolean {
    const rol = this.getDecodedToken()?.rol;
    if (!rol) return false;
    const normalizar = (r: string) => r.toUpperCase().replace('ROLE_', '');
    return normalizar(rol) === normalizar(expectedRole);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getUserName(): string | null {
    return this.getDecodedToken()?.nombre ?? null;
  }

  getUserEmail(): string | null {
    return this.getDecodedToken()?.sub ?? null;
  }

  // Alias para que calcen los nombres usados en el sidebar/guards que ya armamos
  userName = () => this.getUserName() ?? '';
  userEmail = () => this.getUserEmail() ?? '';
}