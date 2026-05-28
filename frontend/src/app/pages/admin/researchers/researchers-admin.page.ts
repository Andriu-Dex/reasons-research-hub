import { Component } from '@angular/core';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-researchers-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './researchers-admin.page.html',
  styleUrl: './researchers-admin.page.css'
})
export class ResearchersAdminPage {
  config: AdminResourceConfig = {
    resource: 'researchers',
    title: 'Investigadores',
    description: 'Administra perfiles, fotografias y visibilidad publica del equipo.',
    emptyMessage: 'Aun no hay investigadores registrados.',
    columns: [
      { key: 'fullName', label: 'Nombre' },
      { key: 'position', label: 'Cargo' },
      { key: 'status', label: 'Estado' }
    ],
    fields: [
      { key: 'fullName', label: 'Nombre completo', type: 'text', required: true },
      { key: 'position', label: 'Cargo o rol', type: 'text', required: true },
      { key: 'biography', label: 'Biografia', type: 'textarea', required: true },
      { key: 'institutionalEmail', label: 'Correo institucional', type: 'email', required: true },
      { key: 'orcid', label: 'ORCID', type: 'text' },
      { key: 'photoMediaId', label: 'Fotografia', type: 'media' },
      { key: 'isFeatured', label: 'Destacado en Home', type: 'checkbox' },
      { key: 'status', label: 'Estado', type: 'select', required: true, options: [
        { label: 'Borrador', value: 'DRAFT' },
        { label: 'Publicado', value: 'PUBLISHED' },
        { label: 'Oculto', value: 'HIDDEN' }
      ] },
      { key: 'displayOrder', label: 'Orden', type: 'number' }
    ]
  };
}
