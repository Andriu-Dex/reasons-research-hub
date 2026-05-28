import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SiteSettings } from '../../../core/models/content.models';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { MediaPickerComponent } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaPickerComponent],
  templateUrl: './settings.page.html',
  styleUrl: './settings.page.css'
})
export class SettingsPage implements OnInit {
  model: Partial<SiteSettings> = {};
  isLoading = true;
  isSaving = false;

  constructor(
    private adminApi: AdminApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminApi.getSiteSettings().subscribe({
      next: (settings) => {
        this.model = settings;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  save(): void {
    this.isSaving = true;
    const payload = {
      institutionName: this.model.institutionName,
      groupName: this.model.groupName,
      acronym: this.model.acronym,
      generalDescription: this.model.generalDescription,
      mission: this.model.mission,
      vision: this.model.vision,
      logoMediaId: this.model.logoMediaId,
      academicDomain: this.model.academicDomain,
      institutionalEmail: this.model.institutionalEmail,
      address: this.model.address,
      colorPrimary: this.model.colorPrimary,
      colorSecondary: this.model.colorSecondary,
      colorBackground: this.model.colorBackground,
      colorSurface: this.model.colorSurface,
      colorText: this.model.colorText,
      footerText: this.model.footerText
    };
    this.adminApi.updateSiteSettings(payload).subscribe({
      next: (settings) => {
        this.model = settings;
        this.isSaving = false;
        this.toastService.success('Configuracion guardada');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.error('No se pudo guardar', 'Revisa los campos obligatorios.');
      }
    });
  }
}
