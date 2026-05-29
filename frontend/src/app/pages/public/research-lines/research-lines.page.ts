import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ResearchLine } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-research-lines-public-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research-lines.page.html',
  styleUrl: './research-lines.page.css'
})
export class ResearchLinesPublicPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  researchLines: ResearchLine[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.publicContentService
      .getResearchLines(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (researchLines) => {
          this.researchLines = researchLines;
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
