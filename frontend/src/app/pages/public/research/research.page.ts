import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Project, Publication, ResearchLine } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';

@Component({
  selector: 'app-research-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './research.page.html',
  styleUrl: './research.page.css'
})
export class ResearchPage {
  private readonly destroyRef = inject(DestroyRef);
  researchLines: ResearchLine[] = [];
  projects: Project[] = [];
  publications: Publication[] = [];
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
        forkJoin({
          researchLines: this.publicContentService.getResearchLines(tenantSlug),
          projects: this.publicContentService.getProjects(tenantSlug),
          publications: this.publicContentService.getPublications(tenantSlug)
        }).subscribe({
          next: (data) => {
            this.researchLines = data.researchLines;
            this.projects = data.projects;
            this.publications = data.publications;
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
