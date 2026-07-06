import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoMuscularDTO, GrupoMuscularInsertDTO, GrupoMuscularService } from '../../service/grupo-muscular-service';

type Modo = 'crear' | 'editar' | null;

@Component({
  selector: 'app-grupomuscularcomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grupomuscularcomponent.html'
})
export class Grupomuscularcomponent implements OnInit {
  private service = inject(GrupoMuscularService);

  grupos = this.service.grupos;
  cargando = this.service.cargando;
  error = this.service.error;

  modo = signal<Modo>(null);
  idEnEdicion = signal<number | null>(null);
  form: GrupoMuscularInsertDTO = this.formVacio();

  ngOnInit(): void {
    this.service.listar();
  }

  formVacio(): GrupoMuscularInsertDTO {
    return { nombre: '', descripcion: '', imagenGrupo: '', colorIndicador: '#facc15' };
  }

  abrirCrear(): void {
    this.form = this.formVacio();
    this.modo.set('crear');
  }

  abrirEditar(g: GrupoMuscularDTO): void {
    // Nota: descripcion e imagenGrupo no vienen en el DTO de respuesta, se editan en blanco.
    this.form = { nombre: g.nombre, descripcion: '', imagenGrupo: '', colorIndicador: g.colorIndicador };
    this.idEnEdicion.set(g.idGrupoMuscular);
    this.modo.set('editar');
  }

  cerrar(): void {
    this.modo.set(null);
    this.idEnEdicion.set(null);
  }

  guardar(): void {
    if (!this.form.nombre.trim()) return;
    if (this.modo() === 'crear') {
      this.service.crear(this.form);
    } else if (this.idEnEdicion() !== null) {
      this.service.actualizar(this.idEnEdicion()!, this.form);
    }
    this.cerrar();
  }

  eliminar(id: number): void {
    if (confirm('¿Eliminar este grupo muscular?')) this.service.eliminar(id);
  }
}