import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Save } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-settings-page',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './settings.page.html',
  styleUrl: './styles/settings.page.css'
})
export class SettingsPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  readonly saveIcon = Save;
  editorValue = '';

  ngOnInit() {
    this.api.getAdmin('site-settings').subscribe((data) => {
      this.editorValue = JSON.stringify(data, null, 2);
    });
  }

  save() {
    try {
      const body = JSON.parse(this.editorValue);
      for (const key of ['id', 'organizationId', 'updatedAt', 'logo', 'socialLinks']) delete body[key];
      this.api.putAdmin('site-settings', body).subscribe({
        next: () => this.toast.show('Configuracion guardada.', 'success'),
        error: () => this.toast.show('No se pudo guardar la configuracion.', 'error')
      });
    } catch {
      this.toast.show('El JSON no es valido.', 'error');
    }
  }
}
