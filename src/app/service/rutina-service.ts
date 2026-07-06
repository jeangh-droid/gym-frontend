import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RutinaDTO {
  idrutina: number; // Asegúrate de que coincida con el JSON exacto de tu Spring Boot
  nombre: string;
  descripcion: string;
  fechaCreacion: string;
}

export interface RutinaInsertDTO {
  nombre: string;
  descripcion: string;
  idUsuario: number; // Vital para la relación en BD
}

@Injectable({ providedIn: 'root' })
export class RutinaService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/rutina`;

  getRutinas(): Observable<RutinaDTO[]> {
    return this.http.get<RutinaDTO[]>(`${this.url}/lista`);
  }

  crearRutina(rutina: RutinaInsertDTO): Observable<RutinaDTO> {
    return this.http.post<RutinaDTO>(`${this.url}/nuevo`, rutina);
  }

  eliminarRutina(id: number): Observable<any> {
    // responseType: 'text' porque Spring Boot devuelve un simple String en el ResponseEntity.ok()
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}