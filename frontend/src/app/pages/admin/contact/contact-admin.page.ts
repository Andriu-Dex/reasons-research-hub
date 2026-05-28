import { Component } from '@angular/core';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-contact-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './contact-admin.page.html',
  styleUrl: './contact-admin.page.css'
})
export class ContactAdminPage {
  config: AdminResourceConfig = {
    resource: 'contact-channels',
    title: 'Canales de contacto',
    description: 'Configura los medios visibles para visitantes en la pagina de contacto.',
    emptyMessage: 'Aun no hay canales registrados.',
    columns: [
      { key: 'type', label: 'Tipo' },
      { key: 'value', label: 'Valor' },
      { key: 'isEnabled', label: 'Activo' }
    ],
    fields: [
      { key: 'type', label: 'Tipo', type: 'text', required: true },
      { key: 'label', label: 'Etiqueta', type: 'text' },
      { key: 'value', label: 'Valor', type: 'text', required: true },
      { key: 'isEnabled', label: 'Activo', type: 'checkbox' },
      { key: 'displayOrder', label: 'Orden', type: 'number' }
    ]
  };
}
