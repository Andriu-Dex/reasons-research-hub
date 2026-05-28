import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsItem } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.page.html',
  styleUrl: './news.page.css'
})
export class NewsPage {
  private readonly destroyRef = inject(DestroyRef);
  news: NewsItem[] = [];
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
        this.publicContentService.getNews(tenantSlug).subscribe({
          next: (news) => {
            this.news = news;
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
