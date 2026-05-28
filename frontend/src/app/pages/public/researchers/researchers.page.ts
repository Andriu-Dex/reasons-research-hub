import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Researcher } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';

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
    private publicContentService: PublicContentService
  ) {
    const tenantSlug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.publicContentService
      .getResearchers(tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (researchers) => {
          this.researchers = researchers;
          this.isLoading = false;
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
        }
      });
  }
}
