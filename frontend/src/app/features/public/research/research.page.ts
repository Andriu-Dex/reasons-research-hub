import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-research-page',
  templateUrl: './research.page.html',
  styleUrl: './styles/research.page.css'
})
export class ResearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly lines = signal<any[]>([]);
  readonly projects = signal<any[]>([]);
  readonly publications = signal<any[]>([]);

  ngOnInit() {
    const slug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.api.getPublic<any[]>(slug, 'research-lines').subscribe((data) => this.lines.set(data));
    this.api.getPublic<any[]>(slug, 'projects').subscribe((data) => this.projects.set(data));
    this.api.getPublic<any[]>(slug, 'publications').subscribe((data) => this.publications.set(data));
  }
}
