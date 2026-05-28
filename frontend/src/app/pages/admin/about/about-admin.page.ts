import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutSettings } from '../../../core/models/content.models';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-about-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about-admin.page.html',
  styleUrl: './about-admin.page.css'
})
export class AboutAdminPage implements OnInit {
  model: Partial<AboutSettings> = {};
  objectivesText = '';
  isLoading = true;
  isSaving = false;

  constructor(private adminApi: AdminApiService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.adminApi.getAboutSettings().subscribe({
      next: (settings) => {
        this.model = settings;
        this.objectivesText = settings.objectives.map((objective) => objective.description).join('\n');
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  save(): void {
    const objectives = this.objectivesText
      .split('\n')
      .map((description, index) => ({ description: description.trim(), displayOrder: index }))
      .filter((objective) => objective.description);
    this.isSaving = true;
    this.adminApi.updateAboutSettings({
      description: this.model.description,
      generalObjective: this.model.generalObjective,
      objectives
    }).subscribe({
      next: (settings) => {
        this.model = settings;
        this.isSaving = false;
        this.toastService.success('Nosotros actualizado');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.error('No se pudo guardar');
      }
    });
  }
}
