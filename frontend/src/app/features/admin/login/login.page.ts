import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogIn } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.page.html',
  styleUrl: './styles/login.page.css'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  readonly loginIcon = LogIn;
  readonly form = this.fb.nonNullable.group({
    email: ['admin@uta.edu.ec', [Validators.required, Validators.email]],
    password: ['Admin12345!', [Validators.required, Validators.minLength(8)]]
  });

  submit() {
    if (this.form.invalid) {
      this.toast.show('Ingrese credenciales validas.', 'error');
      return;
    }

    this.auth.login(this.form.value.email ?? '', this.form.value.password ?? '').subscribe({
      next: (session) => {
        const slug = session.admin.organizationSlug ?? 'uta-reasons';
        this.toast.show('Sesion iniciada correctamente.', 'success');
        void this.router.navigate(session.admin.role === 'SUPER_ADMIN' ? ['/admin/organizations'] : ['/admin', slug, 'dashboard']);
      },
      error: () => this.toast.show('Credenciales incorrectas.', 'error')
    });
  }
}
