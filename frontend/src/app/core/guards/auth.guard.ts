import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const tenantSlug = route.paramMap.get('tenantSlug');

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/login']);
  }

  return authService.belongsToTenant(tenantSlug)
    ? true
    : router.createUrlTree([authService.getAdminHome()]);
};
