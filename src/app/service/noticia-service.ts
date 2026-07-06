import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface NoticiaDTO {
  idNoticia: number;
  titulo: string;
  contenido: string;
  tipo: string;
  imagenUrl: string;
  fechaPublicacion: string;
}

export interface NoticiaInsertDTO {
  titulo: string;
  contenido: string;
  tipo: string;
  imagenUrl: string;
}

@Injectable({ providedIn: 'root' })
export class NoticiaService {
  private http = inject(HttpClient);
  private readonly apiUrl = `http://localhost:8080/api/noticias`;

  private _noticias = signal<NoticiaDTO[]>([]);
  private _cargando = signal(false);
  private _error = signal<string | null>(null);

  noticias = this._noticias.asReadonly();
  cargando = this._cargando.asReadonly();
  error = this._error.asReadonly();

  listar(): void {
    this._cargando.set(true);
    this._error.set(null);
    this.http.get<NoticiaDTO[]>(`${this.apiUrl}/lista`).subscribe({
      next: (data) => { this._noticias.set(data); this._cargando.set(false); },
      error: () => { this._error.set('No se pudo cargar la lista de noticias'); this._cargando.set(false); }
    });
  }

  crear(dto: NoticiaInsertDTO): void {
    this.http.post<NoticiaDTO>(`${this.apiUrl}/nuevo`, dto).subscribe({
      next: (creada) => this._noticias.update(lista => [creada, ...lista]),
      error: () => this._error.set('No se pudo crear la noticia')
    });
  }

  actualizar(id: number, dto: NoticiaInsertDTO): void {
    this.http.put<NoticiaDTO>(`${this.apiUrl}/${id}`, dto).subscribe({
      next: (actualizada) => this._noticias.update(lista =>
        lista.map(n => n.idNoticia === id ? actualizada : n)),
      error: () => this._error.set('No se pudo actualizar la noticia')
    });
  }

  eliminar(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this._noticias.update(lista => lista.filter(n => n.idNoticia !== id)),
      error: () => this._error.set('No se pudo eliminar la noticia')
    });
  }
}