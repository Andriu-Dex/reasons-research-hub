import { Injectable, computed, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import type { AuthAdmin, AuthSession } from '../models/api.models';

const accessTokenKey = 'reasons_access_token';
const adminKey = 'reasons_admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly adminSignal = signal<AuthAdmin | null>(this.readAdmin());
  public readonly admin = this.adminSignal.asReadonly();
  public readonly isAuthenticated = computed(() => Boolean(this.accessToken && this.adminSignal()));
  public readonly isSuperAdmin = computed(() => this.adminSignal()?.role === 'SUPER_ADMIN');

  constructor(private readonly api: ApiService) {}

  get accessToken() {
    return localStorage.getItem(accessTokenKey);
  }

  login(email: string, password: string) {
    return this.api.postAuth<AuthSession>('login', { email, password }).pipe(
      tap((session) => this.persistSession(session))
    );
  }

  logout() {
    return this.api.postAuth<void>('logout', {}).pipe(
      tap(() => {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(adminKey);
        this.adminSignal.set(null);
      })
    );
  }

  private persistSession(session: AuthSession) {
    localStorage.setItem(accessTokenKey, session.accessToken);
    localStorage.setItem(adminKey, JSON.stringify(session.admin));
    this.adminSignal.set(session.admin);
  }

  private readAdmin() {
    const raw = localStorage.getItem(adminKey);
    return raw ? (JSON.parse(raw) as AuthAdmin) : null;
  }
}
