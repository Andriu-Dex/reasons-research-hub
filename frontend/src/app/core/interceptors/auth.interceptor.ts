import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();
  const isBackendRequest = request.url.startsWith(`${environment.apiUrl}/`);

  if (!token || !isBackendRequest || request.url.includes('/auth/')) {
    return next(request);
  }

  const authenticatedRequest = request.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }

      return authService.refresh().pipe(
        switchMap(({ accessToken }) =>
          next(request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } }))
        ),
        catchError((refreshError: unknown) => {
          authService.clearSession();
          void router.navigateByUrl('/admin/login');
          return throwError(() => refreshError);
        })
      );
    })
  );
};
