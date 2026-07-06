import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EjercicioService, EjercicioDTO, EjercicioInsertDTO } from '../../service/ejercicio-service';
import { GrupoMuscularService } from '../../service/grupo-muscular-service';
import { AuthService } from '../../features/auth/service/auth-service';

type Modo = 'crear' | 'editar' | null;

@Component({
  selector: 'app-ejercicioscomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejercicioscomponent.html'
})
export class Ejercicioscomponent implements OnInit {
  private service = inject(EjercicioService);
  grupoService = inject(GrupoMuscularService);
  private authService = inject(AuthService);

  isAdmin = this.authService.hasRole('ROLE_ADMIN'); // signal existente, se reutiliza directo

  ejercicios = this.service.ejercicios;
  cargando = this.service.cargando;
  error = this.service.error;
  grupos = this.grupoService.grupos;

  filtroGrupo = signal<number | null>(null);

  mapaGrupos = computed(() => {
    const mapa = new Map<number, { nombre: string; color: string }>();
    for (const g of this.grupos()) mapa.set(g.idGrupoMuscular, { nombre: g.nombre, color: g.colorIndicador });
    return mapa;
  });

  modo = signal<Modo>(null);
  idEnEdicion = signal<number | null>(null);
  form: EjercicioInsertDTO = this.formVacio();

  ngOnInit(): void {
    this.grupoService.listar();
    this.service.listar();
  }

  formVacio(): EjercicioInsertDTO {
    return { nombre: '', descripcion: '', equipo: '', imagenUrl: '', idGrupoMuscular: 0 };
  }

  nombreGrupo(id: number): string {
    return this.mapaGrupos().get(id)?.nombre ?? 'Sin grupo';
  }

  colorGrupo(id: number): string {
    return this.mapaGrupos().get(id)?.color ?? '#999999';
  }

  filtrar(idGrupo: string): void {
    const id = idGrupo ? Number(idGrupo) : null;
    this.filtroGrupo.set(id);
    id === null ? this.service.listar() : this.service.listarPorGrupo(id);
  }

  abrirCrear(): void {
    if (!this.isAdmin) return; // guarda extra por seguridad
    this.form = this.formVacio();
    this.modo.set('crear');
  }

  abrirEditar(e: EjercicioDTO): void {
    if (!this.isAdmin) return;
    this.form = { nombre: e.nombre, descripcion: e.descripcion, equipo: e.equipo, imagenUrl: e.imagenUrl, idGrupoMuscular: e.idGrupoMuscular };
    this.idEnEdicion.set(e.idEjercicio);
    this.modo.set('editar');
  }

  cerrar(): void {
    this.modo.set(null);
    this.idEnEdicion.set(null);
  }

  guardar(): void {
    if (!this.isAdmin || !this.form.nombre.trim() || !this.form.idGrupoMuscular) return;
    if (this.modo() === 'crear') {
      this.service.crear(this.form);
    } else if (this.idEnEdicion() !== null) {
      this.service.actualizar(this.idEnEdicion()!, this.form);
    }
    this.cerrar();
  }

  eliminar(id: number): void {
    if (!this.isAdmin) return;
    if (confirm('¿Eliminar este ejercicio?')) this.service.eliminar(id);
  }
}