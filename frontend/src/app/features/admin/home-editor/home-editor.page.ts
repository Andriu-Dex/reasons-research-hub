import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Save } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-home-editor-page',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './home-editor.page.html',
  styleUrl: './styles/home-editor.page.css'
})
export class HomeEditorPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  readonly saveIcon = Save;
  editorValue = '';

  ngOnInit() {
    this.api.getAdmin('home-settings').subscribe((data) => (this.editorValue = JSON.stringify(data, null, 2)));
  }

  save() {
    try {
      const body = JSON.parse(this.editorValue);
      for (const key of ['id', 'organizationId', 'updatedAt', 'banner']) delete body[key];
      this.api.putAdmin('home-settings', body).subscribe({
        next: () => this.toast.show('Home guardado.', 'success'),
        error: () => this.toast.show('No se pudo guardar el Home.', 'error')
      });
    } catch {
      this.toast.show('El JSON no es valido.', 'error');
    }
  }
}
