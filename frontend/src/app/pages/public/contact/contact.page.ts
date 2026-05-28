import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ContactChannel } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { TenantContextService } from '../../../core/services/tenant-context.service';
import { ToastService } from '../../../shared/toast/toast.service';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css'
})
export class ContactPage implements AfterViewInit {
  @ViewChild('turnstileContainer') private turnstileContainer?: ElementRef<HTMLElement>;
  private readonly destroyRef = inject(DestroyRef);
  readonly turnstileSiteKey = environment.turnstileSiteKey;
  tenantSlug = 'uta-reasons';
  channels: ContactChannel[] = [];
  isSubmitting = false;
  turnstileToken = '';
  contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private tenantContextService: TenantContextService,
    private toastService: ToastService
  ) {
    const routeTenantSlug = this.route.parent?.snapshot.paramMap.get('tenantSlug');
    if (routeTenantSlug) {
      this.tenantContextService.setTenantSlug(routeTenantSlug);
    }

    this.tenantContextService.tenantSlug$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tenantSlug) => {
        this.tenantSlug = tenantSlug;
        this.publicContentService
          .getContactChannels(this.tenantSlug)
          .subscribe({ next: (channels) => (this.channels = channels) });
      });
  }

  ngAfterViewInit(): void {
    if (!this.turnstileSiteKey || !this.turnstileContainer) return;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderTurnstile();
    document.head.appendChild(script);
  }

  submit(form: NgForm): void {
    if (form.invalid || this.isSubmitting) {
      this.toastService.error('Campos incompletos', 'Completa los datos obligatorios.');
      return;
    }

    if (this.turnstileSiteKey && !this.turnstileToken) {
      this.toastService.warning('Verificacion pendiente', 'Completa la verificacion antes de enviar.');
      return;
    }

    this.isSubmitting = true;
    this.publicContentService
      .sendContactMessage(this.tenantSlug, { ...this.contact, turnstileToken: this.turnstileToken })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastService.success('Mensaje enviado', 'Gracias por escribirnos. Te contactaremos pronto.');
          this.turnstileToken = '';
          form.resetForm();
        },
        error: () => {
          this.toastService.error('No se pudo enviar', 'Revisa la informacion o intenta nuevamente mas tarde.');
        }
      });
  }

  private renderTurnstile(): void {
    if (!this.turnstileContainer || !window.turnstile || !this.turnstileSiteKey) return;
    window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: this.turnstileSiteKey,
      callback: (token) => {
        this.turnstileToken = token;
      }
    });
  }
}
