import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-publications-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './publications-admin.page.html',
  styleUrl: './publications-admin.page.css'
})
export class PublicationsAdminPage implements OnInit {
  lookupOptions: Record<string, Array<{ label: string; value: string }>> = {};
  config: AdminResourceConfig = {
    resource: 'publications',
    title: 'Publicaciones',
    description: 'Administra articulos, citas, autores, DOI y visibilidad publica.',
    emptyMessage: 'Aun no hay publicaciones registradas.',
    columns: [
      { key: 'title', label: 'Titulo' },
      { key: 'doi', label: 'DOI' },
      { key: 'status', label: 'Estado' }
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'abstract', label: 'Resumen', type: 'textarea', required: true },
      { key: 'citation', label: 'Cita', type: 'textarea', required: true },
      { key: 'coverMediaId', label: 'Portada', type: 'media' },
      { key: 'doi', label: 'DOI', type: 'text' },
      { key: 'externalLink', label: 'Enlace externo', type: 'url' },
      { key: 'projectId', label: 'Proyecto asociado', type: 'select' },
      { key: 'authorIds', label: 'Autores', type: 'multiselect' },
      { key: 'publishedAt', label: 'Fecha de publicacion', type: 'date' },
      { key: 'isFeatured', label: 'Destacada', type: 'checkbox' },
      { key: 'status', label: 'Estado', type: 'select', options: [
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
      authors: this.adminApi.list('authors'),
      projects: this.adminApi.list('projects')
    }).subscribe(({ authors, projects }) => {
      this.lookupOptions = {
        authorIds: authors.map((item) => ({ label: item.fullName, value: item.id })),
        projectId: projects.map((item) => ({ label: item.title, value: item.id }))
      };
    });
  }
}
