import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsItem } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-news-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './news.page.html',
  styleUrl: './news.page.css'
})
export class NewsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  news: NewsItem[] = [];
  isLoading = true;
  hasError = false;
  tenantSlug = 'uta-reasons';

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSlug = getRouteTenantSlug(this.route);
    this.publicContentService
      .getNews(this.tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (news) => {
          this.news = news;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}
