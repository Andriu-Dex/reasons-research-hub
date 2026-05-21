import { NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ToastItem, ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  constructor(private toastService: ToastService) {}

  toasts(): ToastItem[] {
    return this.toastService.toasts();
  }

  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }

  trackToast(_index: number, toast: ToastItem): number {
    return toast.id;
  }
}
