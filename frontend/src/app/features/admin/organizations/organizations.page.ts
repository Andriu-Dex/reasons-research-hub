import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-organizations-page',
  imports: [FormsModule],
  templateUrl: './organizations.page.html',
  styleUrl: './styles/organizations.page.css'
})
export class OrganizationsPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  readonly organizations = signal<any[]>([]);
  editorValue = JSON.stringify({ name: '', slug: '', primaryDomain: null, status: 'ACTIVE' }, null, 2);

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getAdmin<any[]>('organizations').subscribe((items) => this.organizations.set(items));
  }

  create() {
    try {
      this.api.postAdmin('organizations', JSON.parse(this.editorValue)).subscribe({
        next: () => {
          this.toast.show('Organizacion creada.', 'success');
          this.load();
        },
        error: () => this.toast.show('No se pudo crear la organizacion.', 'error')
      });
    } catch {
      this.toast.show('El JSON no es valido.', 'error');
    }
  }
}
