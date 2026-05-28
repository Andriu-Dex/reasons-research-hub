import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

export function getRouteTenantSlug(route: ActivatedRoute): string {
  return route.parent?.snapshot.paramMap.get('tenantSlug') ?? environment.defaultTenantSlug;
}
