import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Send } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './contact.page.html',
  styleUrl: './styles/contact.page.css'
})
export class ContactPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly sendIcon = Send;
  readonly tenantSlug = signal('uta-reasons');
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  ngOnInit() {
    this.tenantSlug.set(this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons');
  }

  submit() {
    if (this.form.invalid) {
      this.toast.show('Revise los campos obligatorios.', 'error');
      return;
    }

    this.api.postPublic(this.tenantSlug(), 'contact', this.form.getRawValue()).subscribe({
      next: () => {
        this.form.reset();
        this.toast.show('Mensaje enviado correctamente.', 'success');
      },
      error: () => this.toast.show('No se pudo enviar el mensaje.', 'error')
    });
  }
}
