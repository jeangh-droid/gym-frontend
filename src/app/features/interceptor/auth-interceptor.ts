import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  // No agregar el token a las rutas públicas de auth
  if (req.url.includes('/auth/login') || req.url.includes('/auth/registro')) {
    return next(req);
  }

  if (token) {
    const clonado = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonado);
  }

  return next(req);
};