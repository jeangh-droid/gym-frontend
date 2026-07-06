import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticiaService } from '../../service/noticia-service';
import { EjercicioService } from '../../service/ejercicio-service';
import { AuthService } from '../../features/auth/service/auth-service';
import { UsuarioService } from '../../service/usuario-service';
import { GrupoMuscularService } from '../../service/grupo-muscular-service';

@Component({
  standalone: true,
  selector: 'app-homecomponent',
  imports: [CommonModule, RouterLink],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent implements OnInit {
  private authService = inject(AuthService);
  private noticiaService = inject(NoticiaService);
  private ejercicioService = inject(EjercicioService);
  private usuarioService = inject(UsuarioService);
  private grupoService = inject(GrupoMuscularService);

  isAdmin = this.authService.hasRole('ROLE_ADMIN');
  userName = this.authService.getUserName();

  noticias = this.noticiaService.noticias;
  ejercicios = this.ejercicioService.ejercicios;

  // Solo se usan si es admin
  usuarios = this.usuarioService.usuarios;
  grupos = this.grupoService.grupos;

  ultimasNoticias = computed(() => this.noticias().slice(0, 3));

  totalUsuarios = computed(() => this.usuarios().length);
  totalNoticias = computed(() => this.noticias().length);
  totalEjercicios = computed(() => this.ejercicios().length);
  totalGrupos = computed(() => this.grupos().length);

  // Equipo de desarrollo
  integrantes = [
    { nombre: 'Abel Leon', foto: '/fotos/foto1.png' },
    { nombre: 'Joel Barrios', foto: '/fotos/foto2.png' },
    { nombre: 'Jesus Lopez', foto: '/fotos/foto3.png' },
    { nombre: 'Jostin Galarza', foto: '/fotos/foto4.png' },
    { nombre: 'Jean Quispe', foto: '/fotos/foto5.png' },
  ];

  ngOnInit(): void {
    // Datos comunes a ambos roles
    this.noticiaService.listar();
    this.ejercicioService.listar();

    // Datos exclusivos de admin
    if (this.isAdmin) {
      this.usuarioService.listar();
      this.grupoService.listar();
    }
  }
}