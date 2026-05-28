import { NgClass } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteSettings } from '../../core/models/content.models';
import { PublicContentService } from '../../core/services/public-content.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

const DEFAULT_LOGO = 'https://i.imgur.com/RARaC9j.png';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, ThemeToggleComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  private readonly destroyRef = inject(DestroyRef);
  tenantSlug = 'uta-reasons';
  siteSettings: SiteSettings | null = null;
  readonly defaultLogo = DEFAULT_LOGO;
  isMenuOpen = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.tenantSlug = params.get('tenantSlug') ?? 'uta-reasons';
      this.loadSiteSettings();
    });
  }

  get logoUrl(): string {
    return this.siteSettings?.logo?.url ?? this.defaultLogo;
  }

  get brandName(): string {
    return this.siteSettings?.acronym || this.siteSettings?.groupName || 'REASONS';
  }

  get brandSubtitle(): string {
    return this.siteSettings?.institutionName || 'Research Hub';
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  private loadSiteSettings(): void {
    this.publicContentService
      .getSiteSettings(this.tenantSlug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (settings) => {
          this.siteSettings = settings;
          this.applySiteVariables(settings);
        },
        error: () => {
          this.siteSettings = null;
        }
      });
  }

  private applySiteVariables(settings: SiteSettings | null): void {
    if (typeof document === 'undefined' || !settings) return;
    const root = document.documentElement;
    root.style.setProperty('--tenant-primary', settings.colorPrimary);
    root.style.setProperty('--tenant-secondary', settings.colorSecondary);
    root.style.setProperty('--tenant-surface', settings.colorSurface);
    root.style.setProperty('--tenant-text', settings.colorText);
  }
}
