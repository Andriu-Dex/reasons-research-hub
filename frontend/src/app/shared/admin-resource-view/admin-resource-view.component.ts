import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService, AdminResource } from '../../core/services/admin-api.service';
import { ToastService } from '../toast/toast.service';
import { MediaPickerComponent } from '../media-picker/media-picker.component';

export type AdminFieldType = 'text' | 'email' | 'url' | 'textarea' | 'number' | 'checkbox' | 'select' | 'date' | 'media' | 'multiselect';

export interface AdminField {
  key: string;
  label: string;
  type: AdminFieldType;
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface AdminResourceConfig {
  resource: AdminResource;
  title: string;
  description: string;
  emptyMessage: string;
  fields: AdminField[];
  columns: Array<{ key: string; label: string }>;
}

@Component({
  selector: 'app-admin-resource-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaPickerComponent],
  templateUrl: './admin-resource-view.component.html',
  styleUrl: './admin-resource-view.component.css'
})
export class AdminResourceViewComponent implements OnInit {
  @Input({ required: true }) config!: AdminResourceConfig;
  @Input() lookupOptions: Record<string, Array<{ label: string; value: string }>> = {};
  items: Array<Record<string, any>> = [];
  filteredItems: Array<Record<string, any>> = [];
  formModel: Record<string, any> = {};
  editingId: string | null = null;
  searchTerm = '';
  isLoading = true;
  isSaving = false;
  showForm = false;


  constructor(
    private adminApi: AdminApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.resetForm();
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.adminApi.list(this.config.resource).subscribe({
      next: (items) => {
        this.items = items as Array<Record<string, any>>;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error('No se pudo cargar', 'Intenta nuevamente.');
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredItems = term
      ? this.items.filter((item) => JSON.stringify(item).toLowerCase().includes(term))
      : [...this.items];
  }

  edit(item: Record<string, any>): void {
    this.editingId = String(item['id']);
    this.formModel = this.normalizeForForm(item);
    this.showForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel(): void {
    this.editingId = null;
    this.resetForm();
    this.showForm = false;
  }

  openCreateForm(): void {
    this.editingId = null;
    this.resetForm();
    this.showForm = true;
  }


  save(): void {
    if (this.isSaving) return;
    this.isSaving = true;
    const body = this.prepareBody();
    const request = this.editingId
      ? this.adminApi.update(this.config.resource, this.editingId, body)
      : this.adminApi.create(this.config.resource, body);

    request.subscribe({
      next: () => {
        this.toastService.success('Cambios guardados', 'La informacion se actualizo correctamente.');
        this.isSaving = false;
        this.cancel();
        this.load();
      },
      error: (error) => {
        this.isSaving = false;
        this.toastService.error('No se pudo guardar', error.error?.message ?? 'Revisa los campos.');
      }
    });
  }

  setStatus(item: Record<string, any>, status: string): void {
    const body = { ...this.normalizeForForm(item), status };
    this.adminApi.update(this.config.resource, String(item['id']), body as never).subscribe({
      next: () => {
        this.toastService.success('Estado actualizado');
        this.load();
      },
      error: () => this.toastService.error('No se pudo cambiar el estado')
    });
  }

  confirmDeleteItem: Record<string, any> | null = null;

  requestDelete(item: Record<string, any>): void {
    this.confirmDeleteItem = item;
  }

  cancelDelete(): void {
    this.confirmDeleteItem = null;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteItem) return;
    const item = this.confirmDeleteItem;
    this.confirmDeleteItem = null;
    this.adminApi.remove(this.config.resource, String(item['id'])).subscribe({
      next: () => {
        this.toastService.success('Registro eliminado');
        this.load();
      },
      error: () => this.toastService.error('No se pudo eliminar', 'Puede existir información relacionada.')
    });
  }

  valueFor(item: Record<string, any>, key: string): string {
    const value = item[key];
    if (typeof value === 'boolean') return value ? 'Si' : 'No';
    if (value === null || value === undefined || value === '') return 'No configurado';
    
    // Translation mappings
    const translations: Record<string, string> = {
      ACADEMIC: 'Académico',
      RESEARCH: 'Investigación',
      PLANNED: 'Planificado',
      IN_PROGRESS: 'En progreso',
      COMPLETED: 'Completado',
      PAUSED: 'Pausado',
      DRAFT: 'Borrador',
      PUBLISHED: 'Publicado',
      HIDDEN: 'Oculto',
      UPDATE: 'Novedad',
      EVENT: 'Evento',
      AGREEMENT: 'Convenio'
    };

    return translations[value] ?? String(value);
  }

  optionsFor(field: AdminField): Array<{ label: string; value: string }> {
    return field.options ?? this.lookupOptions[field.key] ?? [];
  }

  private resetForm(): void {
    this.formModel = {};
    for (const field of this.config.fields) {
      if (field.type === 'checkbox') this.formModel[field.key] = field.key === 'isEnabled';
      else if (field.type === 'number') this.formModel[field.key] = 0;
      else if (field.type === 'multiselect') this.formModel[field.key] = [];
      else if (field.type === 'select' && field.options?.length) this.formModel[field.key] = field.options[0]?.value ?? '';
      else this.formModel[field.key] = '';
    }
  }

  private normalizeForForm(item: Record<string, any>): Record<string, any> {
    const model: Record<string, any> = {};
    for (const field of this.config.fields) {
      model[field.key] = item[field.key] ?? (field.type === 'multiselect' ? [] : '');
    }
    if (this.config.resource === 'projects') {
      model['researcherIds'] = (item['researchers'] ?? []).map((entry: any) => entry.researcherId ?? entry.researcher?.id).filter(Boolean);
      model['researchLineIds'] = (item['researchLines'] ?? []).map((entry: any) => entry.researchLineId ?? entry.researchLine?.id).filter(Boolean);
    }
    if (this.config.resource === 'publications') {
      model['authorIds'] = (item['authors'] ?? []).map((entry: any) => entry.authorId ?? entry.author?.id).filter(Boolean);
      model['publishedAt'] = item['publishedAt']?.slice(0, 10) ?? '';
    }
    if (this.config.resource === 'news') {
      model['publishedAt'] = item['publishedAt']?.slice(0, 10) ?? '';
    }
    return model;
  }

  private prepareBody(): Record<string, any> {
    const body = { ...this.formModel };
    for (const field of this.config.fields) {
      if (field.type === 'number') body[field.key] = Number(body[field.key] ?? 0);
      if (field.type === 'media' && !body[field.key]) body[field.key] = null;
      if (field.type === 'select' && !body[field.key]) body[field.key] = null;
    }
    return body;
  }
}
