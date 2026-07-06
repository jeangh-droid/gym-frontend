import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos = route.data['roles'] as string[] | undefined;

  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  const tieneAcceso = rolesPermitidos.some(rol => authService.hasRole(rol));

  if (tieneAcceso) {
    return true;
  }

  router.navigate(['/menu/homes']);
  return false;
};