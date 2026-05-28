import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Researcher } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  selector: 'app-researchers-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './researchers.page.html',
  styleUrl: './researchers.page.css'
})
export class ResearchersPage {
  private readonly destroyRef = inject(DestroyRef);
  researchers: Researcher[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private tenantContextService: TenantContextService
  ) {
    const routeTenantSlug = this.route.parent?.snapshot.paramMap.get('tenantSlug');
    if (routeTenantSlug) {
      this.tenantContextService.setTenantSlug(routeTenantSlug);
    }

    this.tenantContextService.tenantSlug$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tenantSlug) => {
        this.isLoading = true;
        this.hasError = false;
        this.publicContentService.getResearchers(tenantSlug).subscribe({
          next: (researchers) => {
            this.researchers = researchers;
            this.isLoading = false;
          },
          error: () => {
            this.hasError = true;
            this.isLoading = false;
          }
        });
      });
  }
}
