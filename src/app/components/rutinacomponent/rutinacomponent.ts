import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../features/auth/service/auth-service';
import { RutinaDTO, RutinaInsertDTO, RutinaService } from '../../service/rutina-service';

@Component({
  selector: 'app-rutinacomponent',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './rutinacomponent.html',
})
export class Rutinacomponent implements OnInit {
  private authService = inject(AuthService);
  private rutinaService = inject(RutinaService);
  private fb = inject(FormBuilder);

  isAdmin = false;
  rutinas: RutinaDTO[] = [];
  cargando = true;

  // Lógica de Admin (Modal y Formulario)
  mostrarModal = false;
  rutinaForm: FormGroup;
  idUsuarioActual: number = 0;

  constructor() {
    this.rutinaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
    
    // Extraemos el ID del usuario del token
    const userIdStr = this.authService.getUserIdFromToken();
    if (userIdStr) {
      this.idUsuarioActual = parseInt(userIdStr, 10);
    }

    this.cargarRutinas();
  }

  cargarRutinas(): void {
    this.cargando = true;
    this.rutinaService.getRutinas().subscribe({
      next: (data) => {
        this.rutinas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar las rutinas', err);
        this.cargando = false;
      }
    });
  }

  // --- MÉTODOS DE ADMINISTRADOR ---

  abrirModalNuevaRutina(): void {
    this.rutinaForm.reset();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  guardarRutina(): void {
    if (this.rutinaForm.invalid) return;

    const nuevaRutina: RutinaInsertDTO = {
      nombre: this.rutinaForm.value.nombre,
      descripcion: this.rutinaForm.value.descripcion,
      idUsuario: this.idUsuarioActual
    };

    this.rutinaService.crearRutina(nuevaRutina).subscribe({
      next: (response) => {
        // Agregamos la nueva rutina a la lista local para no recargar toda la página
        this.rutinas.push(response);
        this.cerrarModal();
      },
      error: (err) => console.error('Error al guardar rutina', err)
    });
  }

  eliminarRutina(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      this.rutinaService.eliminarRutina(id).subscribe({
        next: () => {
          // Filtramos la lista para quitar la eliminada
          this.rutinas = this.rutinas.filter(r => r.idrutina !== id);
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }
}