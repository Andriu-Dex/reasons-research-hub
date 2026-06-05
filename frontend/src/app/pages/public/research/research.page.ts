import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Project, Publication, ResearchLine } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-research-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './research.page.html',
  styleUrl: './research.page.css'
})
export class ResearchPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  researchLines: ResearchLine[] = [];
  projects: Project[] = [];
  publications: Publication[] = [];
  isLoading = true;
  hasError = false;
  tenantSlug = 'uta-reasons';

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const tenantSlug = getRouteTenantSlug(this.route);
    this.tenantSlug = tenantSlug;
    forkJoin({
      researchLines: this.publicContentService.getResearchLines(tenantSlug),
      projects: this.publicContentService.getProjects(tenantSlug),
      publications: this.publicContentService.getPublications(tenantSlug)
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.researchLines = data.researchLines;
          this.projects = data.projects;
          this.publications = data.publications;
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

  projectStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PLANNED: 'Planificado',
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completado',
      PAUSED: 'Pausado'
    };
    return labels[status] ?? status;
  }
}
