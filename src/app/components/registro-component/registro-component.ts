import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../features/auth/service/auth-service';
import { RegistroRequest } from '../../features/auth/model/registro-request';

@Component({
  selector: 'app-registro-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './registro-component.html'
})
export class RegistroComponent {

  paso = signal<1 | 2>(1);
  loading = false;
  error = '';

  formPaso1: FormGroup;
  formPaso2: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formPaso1 = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correoInstitucional: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9._%+-]+@untels\.edu\.pe$/)
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!.*_-]).{6,}$/)
      ]],
      genero: ['Masculino', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });

    this.formPaso2 = this.fb.group({
      peso: [null, [Validators.required, Validators.min(20), Validators.max(400)]],
      estatura: [null, [Validators.required, Validators.min(1), Validators.max(2.5)]],
      nivel: [1, Validators.required],
      objetivo: ['Ganar masa muscular', Validators.required]
    });
  }

  get correoInvalido(): boolean {
    const c = this.formPaso1.get('correoInstitucional')!;
    return c.touched && c.invalid;
  }

  get contrasenaInvalida(): boolean {
    const c = this.formPaso1.get('contrasena')!;
    return c.touched && c.invalid;
  }

  irAPaso2(): void {
    if (this.formPaso1.invalid) {
      this.formPaso1.markAllAsTouched();
      return;
    }
    this.paso.set(2);
  }

  regresar(): void {
    this.paso.set(1);
  }

  crearCuenta(): void {
    if (this.formPaso2.invalid) {
      this.formPaso2.markAllAsTouched();
      return;
    }

    const request: RegistroRequest = {
      ...this.formPaso1.value,
      ...this.formPaso2.value
    };

    this.loading = true;
    this.error = '';

    this.authService.registrar(request).subscribe({
      next: () => {
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 409
          ? 'Ya existe una cuenta con ese correo institucional'
          : 'No se pudo completar el registro, revisa tus datos';
      }
    });
  }
}