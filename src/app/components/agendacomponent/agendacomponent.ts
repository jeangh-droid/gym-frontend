import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../features/auth/service/auth-service';
import { ReservaAdminDTO, ReservaService } from '../../service/reserva-service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-agendacomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agendacomponent.html',
  styleUrls: ['./agendacomponent.css']
})
export class Agendacomponent implements OnInit {
  private authService = inject(AuthService);
  private reservaService = inject(ReservaService);

  // 1. Implementación de Signals para el estado reactivo
  isAdmin = signal<boolean>(false);
  reservas = signal<ReservaAdminDTO[]>([]); 
  cargando = signal<boolean>(true);

  ngOnInit() {
    // Verificamos si es administrador y actualizamos el Signal
    this.isAdmin.set(this.authService.hasRole('ROLE_ADMIN'));
    
    // 2. Lógica condicional: El Admin ve todo, el Usuario ve su historial
    if (this.isAdmin()) {
      this.cargarTodasLasReservas();
    } else {
      const userIdStr = this.authService.getUserIdFromToken();
      if (userIdStr) {
        this.cargarReservasUsuario(Number(userIdStr));
      }
    }
  }

  // Método para el USUARIO normal
  cargarReservasUsuario(userId: number) {
    this.cargando.set(true);
    this.reservaService.getHistorial(userId).subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar tu historial de reservas', err);
        this.cargando.set(false);
      }
    });
  }

  // Método exclusivo para el ADMIN
  cargarTodasLasReservas() {
    this.cargando.set(true);
    // Asegúrate de tener este método en tu ReservaService apuntando a GET /api/reservas/lista-admin
    this.reservaService.getTodasLasReservas().subscribe({
      next: (data) => {
        this.reservas.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la agenda general', err);
        this.cargando.set(false);
      }
    });
  }

}