import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PerfilService, UsuarioActualizarDTO } from '../../service/perfil-service';

@Component({
  selector: 'app-perfilcomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfilcomponent.html'
})
export class Perfilcomponent implements OnInit {
  private service = inject(PerfilService);

  perfil = this.service.perfil;
  cargando = this.service.cargando;
  error = this.service.error;

  editando = signal(false);
  form: UsuarioActualizarDTO = { peso: 0, estatura: 0, nivel: 1, objetivo: '' };

  ngOnInit(): void {
    this.service.cargarPerfil();
  }

  abrirEdicion(): void {
    const p = this.perfil();
    if (!p) return;
    this.form = { peso: p.peso, estatura: p.estatura, nivel: p.nivel, objetivo: p.objetivo };
    this.editando.set(true);
  }

  cancelar(): void {
    this.editando.set(false);
  }

  guardar(): void {
    this.service.actualizarPerfil(this.form);
    this.editando.set(false);
  }
}