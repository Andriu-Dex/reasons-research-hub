import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-projects-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './projects-admin.page.html',
  styleUrl: './projects-admin.page.css'
})
export class ProjectsAdminPage implements OnInit {
  lookupOptions: Record<string, Array<{ label: string; value: string }>> = {};
  config: AdminResourceConfig = {
    resource: 'projects',
    title: 'Proyectos',
    description: 'Gestiona investigaciones, estado de avance, equipo y lineas asociadas.',
    emptyMessage: 'Aun no hay proyectos registrados.',
    columns: [
      { key: 'title', label: 'Titulo' },
      { key: 'projectType', label: 'Tipo' },
      { key: 'projectStatus', label: 'Avance' },
      { key: 'status', label: 'Estado' }
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'description', label: 'Descripcion', type: 'textarea', required: true },
      { key: 'objectives', label: 'Objetivos', type: 'textarea', required: true },
      { key: 'results', label: 'Resultados', type: 'textarea' },
      { key: 'mainMediaId', label: 'Imagen principal', type: 'media' },
      { key: 'projectType', label: 'Tipo de proyecto', type: 'select', options: [
        { label: 'Investigación', value: 'RESEARCH' },
        { label: 'Académico', value: 'ACADEMIC' }
      ] },
      { key: 'projectStatus', label: 'Estado del proyecto', type: 'select', options: [
        { label: 'Planificado', value: 'PLANNED' },
        { label: 'En progreso', value: 'IN_PROGRESS' },
        { label: 'Completado', value: 'COMPLETED' },
        { label: 'Pausado', value: 'PAUSED' }
      ] },
      { key: 'researcherIds', label: 'Investigadores', type: 'multiselect' },
      { key: 'researchLineIds', label: 'Lineas de investigacion', type: 'multiselect' },
      { key: 'isFeatured', label: 'Destacado en Home', type: 'checkbox' },
      { key: 'status', label: 'Estado publico', type: 'select', options: [
        { label: 'Borrador', value: 'DRAFT' },
        { label: 'Publicado', value: 'PUBLISHED' },
        { label: 'Oculto', value: 'HIDDEN' }
      ] },
      { key: 'displayOrder', label: 'Orden', type: 'number' }
    ]
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    forkJoin({
      researchers: this.adminApi.list('researchers'),
      researchLines: this.adminApi.list('research-lines')
    }).subscribe(({ researchers, researchLines }) => {
      this.lookupOptions = {
        researcherIds: researchers.map((item) => ({ label: item.fullName, value: item.id })),
        researchLineIds: researchLines.map((item) => ({ label: item.title, value: item.id }))
      };
    });
  }
}
