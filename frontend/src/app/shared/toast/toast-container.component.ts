import { Component, inject } from '@angular/core';
import { X } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [LucideAngularModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './styles/toast-container.component.css'
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  readonly closeIcon = X;
}
