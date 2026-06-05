import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.page.html',
  styleUrl: './projects.page.css'
})
export class ProjectsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  mode: ProjectsMode = 'research';
  projects: Project[] = [];
  isLoading = true;
  hasError = false;
  selectedProject: Project | null = null;

  // Search & Filter state
  searchTerm = '';
  activeStatusFilter: 'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' = 'ALL';
  currentPage = 1;
  pageSize = 6;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  openModal(project: Project): void {
    this.selectedProject = project;
    document.body.style.overflow = 'hidden';
    this.changeDetectorRef.markForCheck();
  }

  closeModal(): void {
    this.selectedProject = null;
    document.body.style.overflow = '';
    this.changeDetectorRef.markForCheck();
  }

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

  // Hero Statistics Getters
  get totalCount(): number {
    return this.projects.length;
  }

  get completedCount(): number {
    return this.projects.filter(p => p.projectStatus === 'COMPLETED').length;
  }

  get inProgressCount(): number {
    return this.projects.filter(p => p.projectStatus === 'IN_PROGRESS').length;
  }

  // Filter & Search Logic
  getFilteredProjects(): Project[] {
    return this.projects.filter((project) => {
      // 1. Status Filter
      if (this.activeStatusFilter !== 'ALL' && project.projectStatus !== this.activeStatusFilter) {
        return false;
      }

      // 2. Search Text (Search title, description, objectives, results, researchers or research lines)
      if (this.searchTerm.trim() !== '') {
        const query = this.searchTerm.toLowerCase();
        const matchesTitle = project.title?.toLowerCase().includes(query);
        const matchesDesc = project.description?.toLowerCase().includes(query);
        const matchesObjectives = project.objectives?.toLowerCase().includes(query);
        const matchesResults = project.results?.toLowerCase().includes(query);
        const matchesResearchers = project.researchers?.some((entry) => 
          entry.researcher.fullName.toLowerCase().includes(query)
        );
        const matchesLines = project.researchLines?.some((entry) => 
          entry.researchLine.title.toLowerCase().includes(query)
        );

        return (
          matchesTitle ||
          matchesDesc ||
          matchesObjectives ||
          matchesResults ||
          !!matchesResearchers ||
          !!matchesLines
        );
      }

      return true;
    });
  }

  get paginatedProjects(): Project[] {
    const filtered = this.getFilteredProjects();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredCount() / this.pageSize) || 1;
  }

  getFilteredCount(): number {
    return this.getFilteredProjects().length;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    const count = this.getFilteredCount();
    return end > count ? count : end;
  }

  getPagesArray(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  setFilter(filter: 'ALL' | 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED'): void {
    this.activeStatusFilter = filter;
    this.currentPage = 1;
    this.changeDetectorRef.markForCheck();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.changeDetectorRef.markForCheck();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onFilterChange();
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.changeDetectorRef.markForCheck();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.changeDetectorRef.markForCheck();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changeDetectorRef.markForCheck();
    }
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
      return projects.filter((project) => project.projectType === 'RESEARCH');
    }

    return projects.filter((project) => project.projectType === 'ACADEMIC');
  }
}

