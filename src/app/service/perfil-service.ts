import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface UsuarioDatosDTO {
  idUsuario: number;
  codigoUniversitario: string;
  nombreCompleto: string;
  correoInstitucional: string;
  genero: string;
  fechaNacimiento: string;
  peso: number;
  estatura: number;
  nivel: number;
  objetivo: string;
}

export interface UsuarioActualizarDTO {
  peso: number;
  estatura: number;
  nivel: number;
  objetivo: string;
}

@Injectable({ providedIn: 'root' })
export class PerfilService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios/perfil`;

  private _perfil = signal<UsuarioDatosDTO | null>(null);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  perfil = this._perfil.asReadonly();
  cargando = this._cargando.asReadonly();
  error = this._error.asReadonly();

  cargarPerfil(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<UsuarioDatosDTO>(this.apiUrl).subscribe({
      next: (data) => { this._perfil.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo cargar tu perfil'); this._cargando.set(false); }
    });
  }

  actualizarPerfil(dto: UsuarioActualizarDTO): void {
    this.http.put<UsuarioDatosDTO>(this.apiUrl, dto).subscribe({
      next: (actualizado) => this._perfil.set(actualizado),
      error: () => this._error.set('No se pudo actualizar tu perfil')
    });
  }
}