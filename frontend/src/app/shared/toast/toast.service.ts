import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesSignal = signal<ToastMessage[]>([]);
  readonly messages = this.messagesSignal.asReadonly();
  private nextId = 1;

  show(text: string, type: ToastMessage['type'] = 'info') {
    const message = { id: this.nextId++, text, type };
    this.messagesSignal.update((messages) => [...messages, message]);
    window.setTimeout(() => this.dismiss(message.id), 4200);
  }

  dismiss(id: number) {
    this.messagesSignal.update((messages) => messages.filter((message) => message.id !== id));
  }
}
