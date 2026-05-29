import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Researcher } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-team-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './team.page.html',
  styleUrl: './team.page.css'
})
export class TeamPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  tenantSlug = 'uta-reasons';
  researchers: Researcher[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSlug = getRouteTenantSlug(this.route);
    this.publicContentService
      .getResearchers(this.tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (researchers) => {
          this.researchers = researchers;
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
