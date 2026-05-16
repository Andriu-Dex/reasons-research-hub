import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Plus, Save, Trash2 } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-resource-editor',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './resource-editor.component.html',
  styleUrl: './styles/resource-editor.component.css'
})
export class ResourceEditorComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  @Input({ required: true }) resource = '';
  @Input({ required: true }) title = '';
  @Input() template: Record<string, unknown> = {};

  readonly addIcon = Plus;
  readonly saveIcon = Save;
  readonly deleteIcon = Trash2;
  readonly items = signal<any[]>([]);
  readonly selectedId = signal<string | null>(null);
  editorValue = '';

  ngOnInit() {
    this.load();
    this.newItem();
  }

  load() {
    this.api.getAdmin<any[]>(this.resource).subscribe((items) => this.items.set(items));
  }

  newItem() {
    this.selectedId.set(null);
    this.editorValue = JSON.stringify(this.template, null, 2);
  }

  edit(item: any) {
    this.selectedId.set(item.id);
    this.editorValue = JSON.stringify(this.cleanItem(item), null, 2);
  }

  save() {
    let body: unknown;
    try {
      body = JSON.parse(this.editorValue);
    } catch {
      this.toast.show('El JSON no es valido.', 'error');
      return;
    }

    const request = this.selectedId()
      ? this.api.putAdmin(`${this.resource}/${this.selectedId()}`, body)
      : this.api.postAdmin(this.resource, body);

    request.subscribe({
      next: () => {
        this.toast.show('Registro guardado correctamente.', 'success');
        this.load();
        this.newItem();
      },
      error: () => this.toast.show('No se pudo guardar el registro.', 'error')
    });
  }

  remove(item: any) {
    if (!confirm('Esta accion eliminara el registro.')) return;
    this.api.deleteAdmin(`${this.resource}/${item.id}`).subscribe({
      next: () => {
        this.toast.show('Registro eliminado.', 'success');
        this.load();
      },
      error: () => this.toast.show('No se pudo eliminar el registro.', 'error')
    });
  }

  private cleanItem(item: Record<string, unknown>) {
    const clone = { ...item };
    for (const key of ['id', 'organizationId', 'createdAt', 'updatedAt', 'photo', 'mainImage', 'coverImage', 'authors']) {
      delete clone[key];
    }
    return clone;
  }
}
