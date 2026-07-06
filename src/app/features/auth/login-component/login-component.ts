import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginRequest } from '../model/login-request';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-component.html',
})
export class LoginComponent {

  loading = false;
  error = '';
  mostrarContrasena = signal(false);
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      correoInstitucional: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9._%+-]+@untels\.edu\.pe$/)
      ]],
      contrasena: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!.*_-]).{6,}$/)
      ]]
    });
  }

  get correoInvalido(): boolean {
    const c = this.loginForm.get('correoInstitucional')!;
    return c.touched && c.invalid;
  }

  get contrasenaInvalida(): boolean {
    const c = this.loginForm.get('contrasena')!;
    return c.touched && c.invalid;
  }

  toggleContrasena(): void {
    this.mostrarContrasena.update(v => !v);
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginForm.value as LoginRequest).subscribe({
      next: () => {
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 401
          ? 'Correo o contraseña incorrectos'
          : 'Ocurrió un error al iniciar sesión, intenta de nuevo';
      }
    });
  }
}