import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SiteSettings } from '../../core/models/content.models';
import { PublicContentService } from '../../core/services/public-content.service';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
import { environment } from '../../../environments/environment';

const DEFAULT_LOGO = 'https://i.imgur.com/RARaC9j.png';

interface PublicNavigationItem {
  label: string;
  path: string;
  children?: PublicNavigationItem[];
}

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
  usesPathTenant = true;
  siteSettings: SiteSettings | null = null;
  readonly defaultLogo = DEFAULT_LOGO;
  isMenuOpen = false;
  readonly currentYear = new Date().getFullYear();
  readonly navigationItems: PublicNavigationItem[] = [
    { label: 'Inicio', path: '' },
    {
      label: 'Nosotros',
      path: 'nosotros',
      children: [
        { label: 'Quiénes somos', path: 'nosotros/quienes-somos' },
        { label: 'Equipo de trabajo', path: 'nosotros/equipo' }
      ]
    },
    {
      label: 'Investigación',
      path: 'investigacion',
      children: [
        { label: 'Líneas de investigación', path: 'investigacion/lineas' },
        { label: 'Libros', path: 'investigacion/libros' },
        { label: 'Artículos científicos', path: 'investigacion/articulos-cientificos' },
        { label: 'Proyectos académicos', path: 'investigacion/proyectos-academicos' },
        { label: 'Proyectos de investigación', path: 'investigacion/proyectos-investigacion' }
      ]
    },
    { label: 'Investigadores', path: 'investigadores' },
    {
      label: 'Noticias',
      path: 'noticias',
      children: [
        { label: 'Novedades', path: 'noticias/novedades' },
        { label: 'Eventos', path: 'noticias/eventos' },
        { label: 'Convenios de cooperación', path: 'noticias/convenios-cooperacion' }
      ]
    },
    { label: 'Contacto', path: 'contacto' }
  ];

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const routeTenantSlug = params.get('tenantSlug');
        this.usesPathTenant = Boolean(routeTenantSlug);

        if (routeTenantSlug) {
          this.setTenant(routeTenantSlug);
          return;
        }

        this.resolveTenantForCurrentHost();
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

  linkTo(path = ''): unknown[] {
    const pathSegments = path.split('/').filter(Boolean);

    if (!this.usesPathTenant) {
      return pathSegments.length ? ['/', ...pathSegments] : ['/'];
    }

    return pathSegments.length ? ['/', this.tenantSlug, ...pathSegments] : ['/', this.tenantSlug];
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
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.siteSettings = null;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private resolveTenantForCurrentHost(): void {
    if (typeof window === 'undefined') {
      this.setTenant(environment.defaultTenantSlug);
      return;
    }

    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      this.setTenant(environment.defaultTenantSlug);
      return;
    }

    this.publicContentService
      .getCurrentTenant()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tenant) => this.setTenant(tenant.slug),
        error: () => this.setTenant(environment.defaultTenantSlug)
      });
  }

  private setTenant(tenantSlug: string): void {
    this.tenantSlug = tenantSlug;
    this.loadSiteSettings();
    this.changeDetectorRef.markForCheck();
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
