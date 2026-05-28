import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MediaFile } from '../../core/models/content.models';
import { AdminApiService } from '../../core/services/admin-api.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './media-picker.component.html',
  styleUrl: './media-picker.component.css'
})
export class MediaPickerComponent implements OnInit {
  @Input() selectedId: string | null | undefined = null;
  @Output() selectedIdChange = new EventEmitter<string | null>();
  mediaFiles: MediaFile[] = [];
  isUploading = false;

  constructor(
    private adminApi: AdminApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.adminApi.getMedia().subscribe({
      next: (files) => (this.mediaFiles = files),
      error: () => this.toastService.error('No se cargaron los medios', 'Intenta nuevamente.')
    });
  }

  select(id: string | null): void {
    this.selectedId = id;
    this.selectedIdChange.emit(id);
  }

  upload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toastService.error('Formato no permitido', 'Usa imagen JPG, PNG o WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.toastService.error('Imagen demasiado grande', 'El tamano maximo es 2 MB.');
      return;
    }

    this.isUploading = true;
    this.adminApi.uploadMedia(file).subscribe({
      next: (media) => {
        this.mediaFiles = [media, ...this.mediaFiles];
        this.select(media.id);
        this.isUploading = false;
        this.toastService.success('Imagen cargada', 'La imagen se registro correctamente.');
      },
      error: () => {
        this.isUploading = false;
        this.toastService.error('No se pudo subir', 'Revisa el archivo o intenta nuevamente.');
      }
    });
  }
}
