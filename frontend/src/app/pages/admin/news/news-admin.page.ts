import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-news-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './news-admin.page.html',
  styleUrl: './news-admin.page.css'
})
export class NewsAdminPage implements OnInit {
  lookupOptions: Record<string, Array<{ label: string; value: string }>> = {};
  config: AdminResourceConfig = {
    resource: 'news',
    title: 'Noticias',
    description: 'Publica eventos, logros, convocatorias y novedades institucionales.',
    emptyMessage: 'Aun no hay noticias registradas.',
    columns: [
      { key: 'title', label: 'Titulo' },
      { key: 'publishedAt', label: 'Fecha' },
      { key: 'status', label: 'Estado' }
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'slug', label: 'Slug', type: 'text', required: true },
      { key: 'summary', label: 'Resumen', type: 'textarea', required: true },
      { key: 'content', label: 'Contenido', type: 'textarea', required: true },
      { key: 'mainMediaId', label: 'Imagen principal', type: 'media' },
      { key: 'publishedAt', label: 'Fecha de publicacion', type: 'date', required: true },
      { key: 'projectId', label: 'Proyecto asociado', type: 'select' },
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
    this.adminApi.list('projects').subscribe((projects) => {
      this.lookupOptions = {
        projectId: projects.map((item) => ({ label: item.title, value: item.id }))
      };
    });
  }
}
