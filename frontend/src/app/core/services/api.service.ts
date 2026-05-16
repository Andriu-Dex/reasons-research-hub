import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  public getPublic<T>(tenantSlug: string, path: string) {
    return this.http.get<T>(`${this.baseUrl}/${tenantSlug}/${path}`);
  }

  public postPublic<T>(tenantSlug: string, path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}/${tenantSlug}/${path}`, body);
  }

  public getAdmin<T>(path: string) {
    return this.http.get<T>(`${this.baseUrl}/admin/${path}`);
  }

  public postAdmin<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}/admin/${path}`, body);
  }

  public putAdmin<T>(path: string, body: unknown) {
    return this.http.put<T>(`${this.baseUrl}/admin/${path}`, body);
  }

  public deleteAdmin(path: string) {
    return this.http.delete<void>(`${this.baseUrl}/admin/${path}`);
  }

  public postAuth<T>(path: string, body: unknown) {
    return this.http.post<T>(`${this.baseUrl}/auth/${path}`, body, { withCredentials: true });
  }
}
