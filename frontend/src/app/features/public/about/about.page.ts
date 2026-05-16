import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about.page.html',
  styleUrl: './styles/about.page.css'
})
export class AboutPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly about = signal<any | null>(null);

  ngOnInit() {
    const slug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.api.getPublic<any>(slug, 'about').subscribe((about) => this.about.set(about));
  }
}
