import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoticiaService, NoticiaDTO, NoticiaInsertDTO } from '../../service/noticia-service';
import { AuthService } from '../../features/auth/service/auth-service';

type Modo = 'crear' | 'editar' | null;

@Component({
  selector: 'app-noticiascomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noticiascomponent.html'
})
export class Noticiascomponent implements OnInit {
  private service = inject(NoticiaService);
  private authService = inject(AuthService);

  isAdmin = this.authService.hasRole('ROLE_ADMIN');

  noticias = this.service.noticias;
  cargando = this.service.cargando;
  error = this.service.error;

  modo = signal<Modo>(null);
  idEnEdicion = signal<number | null>(null);
  form: NoticiaInsertDTO = this.formVacio();

  ngOnInit(): void {
    this.service.listar();
  }

  formVacio(): NoticiaInsertDTO {
    return { titulo: '', contenido: '', tipo: 'General', imagenUrl: '' };
  }

  abrirCrear(): void {
    if (!this.isAdmin) return;
    this.form = this.formVacio();
    this.modo.set('crear');
  }

  abrirEditar(n: NoticiaDTO): void {
    if (!this.isAdmin) return;
    this.form = { titulo: n.titulo, contenido: n.contenido, tipo: n.tipo, imagenUrl: n.imagenUrl };
    this.idEnEdicion.set(n.idNoticia);
    this.modo.set('editar');
  }

  cerrar(): void {
    this.modo.set(null);
    this.idEnEdicion.set(null);
  }

  guardar(): void {
    if (!this.isAdmin || !this.form.titulo.trim() || !this.form.contenido.trim()) return;
    if (this.modo() === 'crear') {
      this.service.crear(this.form);
    } else if (this.idEnEdicion() !== null) {
      this.service.actualizar(this.idEnEdicion()!, this.form);
    }
    this.cerrar();
  }

  eliminar(id: number): void {
    if (!this.isAdmin) return;
    if (confirm('¿Eliminar esta noticia?')) this.service.eliminar(id);
  }
}