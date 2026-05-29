import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HomePayload } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css'
})
export class HomePage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  tenantSlug = 'uta-reasons';
  data: HomePayload | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSlug = getRouteTenantSlug(this.route);
    this.load();
  }

  get heroImage(): string {
    return this.data?.homeSettings?.banner?.url
      ?? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkg55L2s5OxyxlodZK3QMsBrm5G1uCaUMzAHcoCjQaYvHbODLHZSTbpvf8mxjR3KIqS9UJu6L3pM3WXzxsYXGoVKce6vASZ7N_7eMJYcAf7aFzqIfms3s0fuvml0iG4AeN64T3Cr21xYvEmrY2ksFKqj_3iOsewfQzk0ZSA0OtGOoaBsIR3aI5xbfjr7Fflv6qbQhKyDmY2y66nD5LG4WPYDz-VvGBKvgfYzo7XHMQs92xqFAS7aiF8j5JJllk-rLH75AizaR-DfQ';
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;
    this.publicContentService
      .getHome(this.tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.data = data;
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
