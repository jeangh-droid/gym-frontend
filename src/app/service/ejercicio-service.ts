import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface EjercicioDTO {
  idEjercicio: number;
  nombre: string;
  descripcion: string;
  equipo: string;
  imagenUrl: string;
  idGrupoMuscular: number;
}

export interface EjercicioInsertDTO {
  nombre: string;
  descripcion: string;
  equipo: string;
  imagenUrl: string;
  idGrupoMuscular: number;
}

@Injectable({ providedIn: 'root' })
export class EjercicioService {
  private http = inject(HttpClient);
  private readonly apiUrl = `http://localhost:8080/api/ejercicios`;

  private _ejercicios = signal<EjercicioDTO[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  ejercicios = this._ejercicios.asReadonly();
  cargando = this._cargando.asReadonly();
  error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<EjercicioDTO[]>(`${this.apiUrl}/lista`).subscribe({
      next: (data) => { this._ejercicios.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo cargar la lista de ejercicios'); this._cargando.set(false); }
    });
  }

  listarPorGrupo(idGrupo: number): void {
    this._cargando.set(true);
    this.http.get<EjercicioDTO[]>(`${this.apiUrl}/grupo/${idGrupo}`).subscribe({
      next: (data) => { this._ejercicios.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo filtrar por grupo muscular'); this._cargando.set(false); }
    });
  }

  crear(dto: EjercicioInsertDTO): void {
    this.http.post<EjercicioDTO>(`${this.apiUrl}/nuevo`, dto).subscribe({
      next: (creado) => this._ejercicios.update(lista => [creado, ...lista]),
      error: () => this._error.set('No se pudo crear el ejercicio')
    });
  }

  actualizar(id: number, dto: EjercicioInsertDTO): void {
    this.http.put<EjercicioDTO>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (actualizado) => this._ejercicios.update(lista =>
        lista.map(e => e.idEjercicio === id ? actualizado : e)),
      error: () => this._error.set('No se pudo actualizar el ejercicio')
    });
  }

  eliminar(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this._ejercicios.update(lista => lista.filter(e => e.idEjercicio !== id)),
      error: () => this._error.set('No se pudo eliminar el ejercicio')
    });
  }
}