import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  private readonly tenantSlugSubject = new BehaviorSubject<string>(environment.defaultTenantSlug);
  readonly tenantSlug$ = this.tenantSlugSubject.asObservable().pipe(
    filter(Boolean),
    distinctUntilChanged()
  );

  setTenantSlug(tenantSlug: string): void {
    this.tenantSlugSubject.next(tenantSlug);
  }

  getTenantSlug(): string {
    return this.tenantSlugSubject.value;
  }
}
