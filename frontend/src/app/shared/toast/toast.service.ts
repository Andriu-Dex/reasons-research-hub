import { Injectable, signal } from '@angular/core';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  title: string;
  message?: string;
  variant: ToastVariant;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly items = signal<ToastItem[]>([]);
  readonly toasts = this.items.asReadonly();
  private nextId = 1;

  show(options: { title: string; message?: string; variant?: ToastVariant; duration?: number }): void {
    const toast: ToastItem = {
      id: this.nextId++,
      title: options.title,
      message: options.message,
      variant: options.variant ?? 'info',
      duration: options.duration ?? 4200
    };

    this.items.update((items) => [toast, ...items]);
    window.setTimeout(() => this.dismiss(toast.id), toast.duration);
  }

  success(title: string, message?: string, duration?: number): void {
    this.show({ title, message, duration, variant: 'success' });
  }

  error(title: string, message?: string, duration?: number): void {
    this.show({ title, message, duration, variant: 'error' });
  }

  info(title: string, message?: string, duration?: number): void {
    this.show({ title, message, duration, variant: 'info' });
  }

  warning(title: string, message?: string, duration?: number): void {
    this.show({ title, message, duration, variant: 'warning' });
  }

  dismiss(id: number): void {
    this.items.update((items) => items.filter((toast) => toast.id !== id));
  }
}
