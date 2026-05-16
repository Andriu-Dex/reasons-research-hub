import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArrowRight, BookOpen, Newspaper, Users } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';
import type { HomeResponse } from '../../../core/models/api.models';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './home.page.html',
  styleUrl: './styles/home.page.css'
})
export class HomePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  readonly arrowIcon = ArrowRight;
  readonly usersIcon = Users;
  readonly bookIcon = BookOpen;
  readonly newsIcon = Newspaper;
  readonly tenantSlug = signal('uta-reasons');
  readonly data = signal<HomeResponse | null>(null);

  ngOnInit() {
    const tenantSlug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.tenantSlug.set(tenantSlug);
    this.api.getPublic<HomeResponse>(tenantSlug, 'home').subscribe((data) => this.data.set(data));
  }
}
