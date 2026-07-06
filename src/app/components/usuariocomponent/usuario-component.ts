import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../service/usuario-service';

@Component({
  selector: 'app-usuarioscomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-component.html'
})
export class Usuarioscomponent implements OnInit {
  private service = inject(UsuarioService);

  cargando = this.service.cargando;
  error = this.service.error;
  total = this.service.total;

  busqueda = signal('');

  usuariosFiltrados = computed(() => {
    const termino = this.busqueda().toLowerCase().trim();
    const lista = this.service.usuarios();
    if (!termino) return lista;
    return lista.filter(u =>
      u.nombreCompleto.toLowerCase().includes(termino) ||
      u.correoInstitucional.toLowerCase().includes(termino));
  });

  ngOnInit(): void {
    this.service.listar();
  }

  eliminar(id: number, nombre: string): void {
    if (confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) {
      this.service.eliminar(id);
    }
  }
}