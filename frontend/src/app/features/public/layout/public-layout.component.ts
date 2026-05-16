import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Menu, X } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import { ThemeService } from '../../../core/services/theme.service';
import type { SiteSettings } from '../../../core/models/api.models';

@Component({
  selector: 'app-public-layout',
  imports: [RouterLink, RouterOutlet, LucideAngularModule],
  templateUrl: './public-layout.component.html',
  styleUrl: './styles/public-layout.component.css'
})
export class PublicLayoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  private readonly theme = inject(ThemeService);

  readonly menuIcon = Menu;
  readonly closeIcon = X;
  readonly menuOpen = signal(false);
  readonly settings = signal<SiteSettings | null>(null);
  readonly tenantSlug = signal('uta-reasons');

  ngOnInit() {
    const tenantSlug = this.route.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.tenantSlug.set(tenantSlug);
    this.api.getPublic<SiteSettings>(tenantSlug, 'site-settings').subscribe((settings) => {
      this.settings.set(settings);
      this.theme.apply(settings);
    });
  }
}
