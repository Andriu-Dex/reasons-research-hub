import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Project } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

type ProjectsMode = 'academic' | 'research';

interface ProjectsViewConfig {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
}

const ACADEMIC_KEYWORDS = ['academico', 'académico', 'docencia', 'formacion', 'formación', 'vinculacion', 'vinculación'];

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.css'
})
export class ProjectsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  mode: ProjectsMode = 'research';
  projects: Project[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get config(): ProjectsViewConfig {
    if (this.mode === 'academic') {
      return {
        eyebrow: 'Proyectos académicos',
        title: 'Iniciativas académicas conectadas con formación y transferencia.',
        description: 'Espacio para proyectos orientados a docencia, vinculación, innovación educativa o colaboración institucional.',
        emptyMessage: 'Aún no hay proyectos académicos publicados.'
      };
    }

    return {
      eyebrow: 'Proyectos de investigación',
      title: 'Proyectos que transforman preguntas científicas en evidencia.',
      description: 'Consulta proyectos publicados, objetivos, resultados y líneas asociadas.',
      emptyMessage: 'Aún no hay proyectos de investigación publicados.'
    };
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'academic' ? 'academic' : 'research';
    this.publicContentService
      .getProjects(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.projects = this.filterProjects(projects);
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

  researchersOf(project: Project): string {
    return project.researchers?.map((entry) => entry.researcher.fullName).join(', ') || 'Participantes por configurar';
  }

  linesOf(project: Project): string {
    return project.researchLines?.map((entry) => entry.researchLine.title).join(', ') || 'Sin líneas asociadas';
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

  private filterProjects(projects: Project[]): Project[] {
    if (this.mode === 'research') {
      return projects.filter((project) => !this.matchesKeywords(project, ACADEMIC_KEYWORDS));
    }

    return projects.filter((project) => this.matchesKeywords(project, ACADEMIC_KEYWORDS));
  }

  private matchesKeywords(project: Project, keywords: string[]): boolean {
    const source = `${project.title} ${project.description} ${project.objectives} ${project.results ?? ''}`.toLowerCase();
    return keywords.some((keyword) => source.includes(keyword));
  }
}
