import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface GrupoMuscularDTO {
  idGrupoMuscular: number;
  nombre: string;
  colorIndicador: string;
}

export interface GrupoMuscularInsertDTO {
  nombre: string;
  descripcion: string;
  imagenGrupo: string;
  colorIndicador: string;
}

@Injectable({ providedIn: 'root' })
export class GrupoMuscularService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/grupoMuscular`;

  private _grupos = signal<GrupoMuscularDTO[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  grupos = this._grupos.asReadonly();
  cargando = this._cargando.asReadonly();
  error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<GrupoMuscularDTO[]>(`${this.apiUrl}/lista`).subscribe({
      next: (data) => { this._grupos.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo cargar la lista de grupos musculares'); this._cargando.set(false); }
    });
  }

  crear(dto: GrupoMuscularInsertDTO): void {
    this._error.set(null);
    this.http.post<GrupoMuscularDTO>(`${this.apiUrl}/nuevo`, dto).subscribe({
      next: (creado) => this._grupos.update(lista => [...lista, creado]),
      error: (err: HttpErrorResponse) => this._error.set(this.extraerMensaje(err, 'No se pudo registrar el grupo muscular'))
    });
  }

  actualizar(id: number, dto: GrupoMuscularInsertDTO): void {
    this._error.set(null);
    this.http.put<GrupoMuscularDTO>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (actualizado) => this._grupos.update(lista =>
        lista.map(g => g.idGrupoMuscular === id ? actualizado : g)),
      error: (err: HttpErrorResponse) => this._error.set(this.extraerMensaje(err, 'No se pudo actualizar el grupo muscular'))
    });
  }

  eliminar(id: number): void {
    this._error.set(null);
    this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).subscribe({
      next: () => this._grupos.update(lista => lista.filter(g => g.idGrupoMuscular !== id)),
      error: (err: HttpErrorResponse) => {
        this._error.set(this.extraerMensaje(err, 'No se pudo eliminar el grupo muscular'));
      }
    });
  }

  private extraerMensaje(err: HttpErrorResponse, fallback: string): string {
    return typeof err.error === 'string' && err.error.trim() ? err.error : fallback;
  }
}