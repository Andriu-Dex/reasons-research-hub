import { Component } from '@angular/core';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-research-lines-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './research-lines.page.html',
  styleUrl: './research-lines.page.css'
})
export class ResearchLinesPage {
  config: AdminResourceConfig = {
    resource: 'research-lines',
    title: 'Lineas de investigacion',
    description: 'Gestiona los ejes academicos visibles en la pagina de investigacion.',
    emptyMessage: 'Aun no hay lineas registradas.',
    columns: [
      { key: 'title', label: 'Titulo' },
      { key: 'status', label: 'Estado' },
      { key: 'displayOrder', label: 'Orden' }
    ],
    fields: [
      { key: 'title', label: 'Titulo', type: 'text', required: true },
      { key: 'description', label: 'Descripcion', type: 'textarea', required: true },
      { key: 'icon', label: 'Icono o codigo breve', type: 'text' },
      { key: 'status', label: 'Estado', type: 'select', required: true, options: [
        { label: 'Borrador', value: 'DRAFT' },
        { label: 'Publicado', value: 'PUBLISHED' },
        { label: 'Oculto', value: 'HIDDEN' }
      ] },
      { key: 'displayOrder', label: 'Orden', type: 'number' }
    ]
  };
}
