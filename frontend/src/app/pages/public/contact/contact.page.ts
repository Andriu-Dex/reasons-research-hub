import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, DestroyRef, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ContactChannel } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';
import { ToastService } from '../../../shared/toast/toast.service';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SCRIPT_ID = 'cloudflare-turnstile-script';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css'
})
export class ContactPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('turnstileContainer') private turnstileContainer?: ElementRef<HTMLElement>;
  private readonly destroyRef = inject(DestroyRef);
  private turnstileWidgetId: string | null = null;
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
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tenantSlug = getRouteTenantSlug(this.route);
    this.publicContentService
      .getContactChannels(this.tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (channels) => {
          this.channels = channels;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterViewInit(): void {
    if (!this.turnstileSiteKey || !this.turnstileContainer) return;
    if (window.turnstile) {
      this.renderTurnstile();
      return;
    }

    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', () => this.renderTurnstile(), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => this.renderTurnstile();
    document.head.appendChild(script);
  }

  ngOnDestroy(): void {
    if (this.turnstileWidgetId && window.turnstile) {
      window.turnstile.remove(this.turnstileWidgetId);
      this.turnstileWidgetId = null;
    }
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
      .pipe(finalize(() => {
        this.isSubmitting = false;
        this.changeDetectorRef.markForCheck();
      }))
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
    if (this.turnstileWidgetId) return;

    this.turnstileWidgetId = window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: this.turnstileSiteKey,
      callback: (token) => {
        this.turnstileToken = token;
        this.changeDetectorRef.markForCheck();
      }
    });
  }
}
