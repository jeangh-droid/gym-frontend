import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReservaAdminDTO {
  idReserva: number;
  nombreUsuario: string; // Nombre del miembro que reservó
  fechaReserva: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/reservas';

  // USER: Ver historial
  getHistorial(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/historial/${idUsuario}`);
  }

  // USER/ADMIN: Crear reserva
  crearReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.url}/nuevo`, reserva);
  }

  // Endpoint hipotético en tu controlador para listar TODAS las reservas al Admin
  getTodasLasReservas(): Observable<ReservaAdminDTO[]> {
    return this.http.get<ReservaAdminDTO[]>(`${this.url}/lista-admin`);
  }
}