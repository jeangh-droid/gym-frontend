import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface UsuarioResponseDTO {
  idUsuario: number;
  correoInstitucional: string;
  nombreCompleto: string;
  peso: number;
  estatura: number;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly apiUrl = `http://localhost:8080/usuarios`;

  private _usuarios = signal<UsuarioResponseDTO[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  usuarios = this._usuarios.asReadonly();
  cargando = this._cargando.asReadonly();
  error = this._error.asReadonly();
  total = computed(() => this._usuarios().length);

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<UsuarioResponseDTO[]>(this.apiUrl).subscribe({
      next: (data) => { this._usuarios.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo cargar la lista de usuarios'); this._cargando.set(false); }
    });
  }

  eliminar(id: number): void {
    this._error.set(null);
    this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).subscribe({
      next: () => this._usuarios.update(lista => lista.filter(u => u.idUsuario !== id)),
      error: (err: HttpErrorResponse) => {
        this._error.set(typeof err.error === 'string' && err.error.trim() ? err.error : 'No se pudo eliminar el usuario');
      }
    });
  }
}