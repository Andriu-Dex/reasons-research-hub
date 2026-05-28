import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { AboutSettings } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.page.html',
  styleUrl: './about.page.css'
})
export class AboutPage {
  private readonly destroyRef = inject(DestroyRef);
  about: AboutSettings | null = null;
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
        this.publicContentService.getAbout(tenantSlug).subscribe({
          next: (about) => {
            this.about = about;
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
