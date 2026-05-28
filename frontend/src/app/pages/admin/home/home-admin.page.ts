import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeSettings } from '../../../core/models/content.models';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { MediaPickerComponent } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-home-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MediaPickerComponent],
  templateUrl: './home-admin.page.html',
  styleUrl: './home-admin.page.css'
})
export class HomeAdminPage implements OnInit {
  model: Partial<HomeSettings> = {};
  isLoading = true;
  isSaving = false;

  constructor(private adminApi: AdminApiService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.adminApi.getHomeSettings().subscribe({
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
      bannerMediaId: this.model.bannerMediaId,
      bannerTitle: this.model.bannerTitle,
      bannerSubtitle: this.model.bannerSubtitle,
      contactButtonText: this.model.contactButtonText
    };
    this.adminApi.updateHomeSettings(payload).subscribe({
      next: (settings) => {
        this.model = settings;
        this.isSaving = false;
        this.toastService.success('Home actualizado');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.error('No se pudo guardar');
      }
    });
  }
}
