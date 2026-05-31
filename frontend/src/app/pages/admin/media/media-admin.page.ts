import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MediaFile } from '../../../core/models/content.models';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { MediaPickerComponent } from '../../../shared/media-picker/media-picker.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-media-admin-page',
  standalone: true,
  imports: [CommonModule, MediaPickerComponent],
  templateUrl: './media-admin.page.html',
  styleUrl: './media-admin.page.css'
})
export class MediaAdminPage implements OnInit {
  mediaFiles: MediaFile[] = [];
  selectedId: string | null = null;

  constructor(private adminApi: AdminApiService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminApi.getMedia().subscribe({ next: (files) => (this.mediaFiles = files) });
  }

  confirmDeleteItem: MediaFile | null = null;

  requestDelete(item: MediaFile): void {
    this.confirmDeleteItem = item;
  }

  cancelDelete(): void {
    this.confirmDeleteItem = null;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteItem) return;
    const id = this.confirmDeleteItem.id;
    this.confirmDeleteItem = null;
    this.adminApi.deleteMedia(id).subscribe({
      next: () => {
        this.toastService.success('Imagen eliminada');
        this.load();
      },
      error: () => this.toastService.error('No se pudo eliminar', 'La imagen puede estar asociada a contenido.')
    });
  }
}
