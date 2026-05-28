import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const API_URL = environment.apiUrl;
const SESSION_KEY = 'reasons-admin-session';

export type AdminRole = 'ORG_ADMIN' | 'SUPER_ADMIN';

export type AdminSession = {
  accessToken: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
    role: AdminRole;
    organizationId: string | null;
    organizationSlug: string | null;
    organizationName: string | null;
  };
};

type RefreshResponse = {
  accessToken: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentSession = signal<AdminSession | null>(this.readSession());
  readonly session = this.currentSession.asReadonly();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<AdminSession> {
    return this.http
      .post<AdminSession>(`${API_URL}/auth/login`, { email, password }, { withCredentials: true })
      .pipe(tap((session) => this.storeSession(session)));
  }

  refresh(): Observable<RefreshResponse> {
    return this.http.post<RefreshResponse>(`${API_URL}/auth/refresh`, {}, { withCredentials: true }).pipe(
      tap(({ accessToken }) => {
        const session = this.currentSession();
        if (session) {
          this.storeSession({ ...session, accessToken });
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${API_URL}/auth/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearSession())
    );
  }

  getAccessToken(): string | null {
    return this.currentSession()?.accessToken ?? null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.currentSession()?.accessToken);
  }

  getAdminHome(): string {
    const session = this.currentSession();
    if (session?.admin.role === 'SUPER_ADMIN') {
      return '/admin/organizations';
    }

    return `/admin/${session?.admin.organizationSlug ?? 'uta-reasons'}/dashboard`;
  }

  belongsToTenant(tenantSlug: string | null): boolean {
    const session = this.currentSession();
    if (!session || !tenantSlug) return false;
    if (session.admin.role === 'SUPER_ADMIN') return true;
    return session.admin.organizationSlug === tenantSlug;
  }

  updateStoredAdmin(admin: Partial<AdminSession['admin']>): void {
    const session = this.currentSession();
    if (!session) return;
    this.storeSession({ ...session, admin: { ...session.admin, ...admin } });
  }

  clearSession(): void {
    this.currentSession.set(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(SESSION_KEY);
    }
  }

  private storeSession(session: AdminSession): void {
    this.currentSession.set(session);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }

  private readSession(): AdminSession | null {
    if (typeof window === 'undefined') {
      return null;
    }

    const storedSession = window.sessionStorage.getItem(SESSION_KEY);
    if (!storedSession) {
      return null;
    }

    try {
      return JSON.parse(storedSession) as AdminSession;
    } catch {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
