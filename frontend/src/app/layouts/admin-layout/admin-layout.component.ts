import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AdminApiService } from '../../core/services/admin-api.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, ThemeToggleComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  isMenuOpen = false;
  isLoggingOut = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    public adminApi: AdminApiService
  ) {}

  ngOnInit(): void {
    // Cargar la configuración inicialmente para obtener el logo dinámico
    this.adminApi.getSiteSettings().subscribe({
      error: () => {
        // Fallback predeterminado ya manejado por el signal
      }
    });
  }

  get initials(): string {
    const fullName = this.authService.session()?.admin.fullName ?? 'Admin';
    return fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  get organizationName(): string {
    return this.authService.session()?.admin.organizationName ?? 'Administracion';
  }

  get roleLabel(): string {
    return this.authService.session()?.admin.role === 'SUPER_ADMIN' ? 'Superadministrador' : 'Gestion institucional';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    if (this.isLoggingOut) return;
    this.isLoggingOut = true;
    this.authService
      .logout()
      .pipe(finalize(() => (this.isLoggingOut = false)))
      .subscribe({
        next: () => void this.router.navigateByUrl('/admin/login'),
        error: () => {
          this.authService.clearSession();
          this.toastService.warning('Sesion cerrada localmente', 'No se pudo contactar al servidor.');
          void this.router.navigateByUrl('/admin/login');
        }
      });
  }
}
