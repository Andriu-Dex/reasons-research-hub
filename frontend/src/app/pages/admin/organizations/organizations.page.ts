import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Organization } from '../../../core/models/content.models';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-organizations-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.page.html',
  styleUrl: './organizations.page.css'
})
export class OrganizationsPage implements OnInit {
  organizations: Organization[] = [];
  model: Partial<Organization> = { status: 'ACTIVE' };
  editingId: string | null = null;

  constructor(private adminApi: AdminApiService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminApi.listOrganizations().subscribe({ next: (organizations) => (this.organizations = organizations) });
  }

  edit(organization: Organization): void {
    this.editingId = organization.id;
    this.model = { ...organization };
  }

  cancel(): void {
    this.editingId = null;
    this.model = { status: 'ACTIVE' };
  }

  save(): void {
    const payload = {
      name: this.model.name,
      slug: this.model.slug,
      primaryDomain: this.model.primaryDomain,
      status: this.model.status
    };
    const request = this.editingId
      ? this.adminApi.updateOrganization(this.editingId, payload)
      : this.adminApi.createOrganization(payload);
    request.subscribe({
      next: () => {
        this.toastService.success('Organizacion guardada');
        this.cancel();
        this.load();
      },
      error: () => this.toastService.error('No se pudo guardar', 'Revisa slug, dominio y datos obligatorios.')
    });
  }
}
