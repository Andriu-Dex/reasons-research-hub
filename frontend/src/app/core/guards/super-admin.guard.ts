import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const superAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const session = authService.session();

  if (!session) {
    return router.createUrlTree(['/admin/login']);
  }

  return session.admin.role === 'SUPER_ADMIN'
    ? true
    : router.createUrlTree(['/admin', session.admin.organizationSlug ?? 'uta-reasons', 'dashboard']);
};
