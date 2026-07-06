import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/service/auth-service';

@Component({
  standalone: true,
  selector: 'app-menucomponent',
  imports: [CommonModule, RouterLink, RouterOutlet, RouterModule],
  templateUrl: './menucomponent.html'
})
export class Menucomponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Implementación de Signals para el estado del menú
  userName = signal<string>('Usuario');
  userCode = signal<string>('2023000000');
  userEmail = signal<string>('');
  isAdmin = signal<boolean>(false);

  ngOnInit(): void {
    // Verificamos el rol
    this.isAdmin.set(this.authService.hasRole('ROLE_ADMIN'));
    
    // Decodificamos el token para extraer los datos
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      this.userName.set(decodedToken.nombre || 'Usuario');
      this.userEmail.set(decodedToken.sub || '');
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        // Limpieza de emergencia si falla la red
        this.authService.clearSession();
        this.router.navigate(['/login']);
      }
    });
  }
}