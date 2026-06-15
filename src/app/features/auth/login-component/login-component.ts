import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-component.html',
})
export class LoginComponent {

  loading = false;
  error = '';

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.loginForm = this.fb.group({
      correoInstitucional: ['', Validators.required],
      contrasena: ['', Validators.required]
    });

  }

  login() {

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login(
      this.loginForm.value as any
    ).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: () => {
        this.error = 'Credenciales incorrectas';
        this.loading = false;
      }
    });

  }
}