import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { AdminResourceConfig, AdminResourceViewComponent } from '../../../shared/admin-resource-view/admin-resource-view.component';

@Component({
  selector: 'app-authors-admin-page',
  standalone: true,
  imports: [AdminResourceViewComponent],
  templateUrl: './authors-admin.page.html',
  styleUrl: './authors-admin.page.css'
})
export class AuthorsAdminPage implements OnInit {
  lookupOptions: Record<string, Array<{ label: string; value: string }>> = {};
  config: AdminResourceConfig = {
    resource: 'authors',
    title: 'Autores',
    description: 'Registra autores internos o externos para asociarlos a publicaciones.',
    emptyMessage: 'Aun no hay autores registrados.',
    columns: [
      { key: 'fullName', label: 'Nombre' },
      { key: 'orcid', label: 'ORCID' },
      { key: 'externalProfileUrl', label: 'Perfil externo' }
    ],
    fields: [
      { key: 'researcherId', label: 'Investigador interno', type: 'select' },
      { key: 'fullName', label: 'Nombre completo', type: 'text', required: true },
      { key: 'orcid', label: 'ORCID', type: 'text' },
      { key: 'externalProfileUrl', label: 'Perfil externo', type: 'url' }
    ]
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.list('researchers').subscribe((researchers) => {
      this.lookupOptions = {
        researcherId: researchers.map((item) => ({ label: item.fullName, value: item.id }))
      };
    });
  }
}
