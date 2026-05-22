import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeToggleComponent } from '../../../shared/theme-toggle/theme-toggle.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ThemeToggleComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  isPasswordVisible = false;
  isSubmitting = false;
  credentials = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      this.toastService.error('Acceso incompleto', 'Ingresa tu correo y contrasena.');
      return;
    }

    this.isSubmitting = true;
    this.authService
      .login(this.credentials.email, this.credentials.password)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastService.success('Sesion iniciada', 'Bienvenido al panel administrativo.');
          void this.router.navigateByUrl(this.authService.getAdminHome());
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error('No se pudo iniciar sesion', error.error?.message ?? 'Revisa tus credenciales.');
        }
      });
  }
}
