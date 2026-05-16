import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './styles/admin-layout.component.css'
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly admin = this.auth.admin;
  readonly slug = this.auth.admin()?.organizationSlug ?? 'uta-reasons';

  logout() {
    this.auth.logout().subscribe(() => void this.router.navigate(['/admin/login']));
  }
}
