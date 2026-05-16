import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-news-page',
  imports: [DatePipe],
  templateUrl: './news.page.html',
  styleUrl: './styles/news.page.css'
})
export class NewsPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly news = signal<any[]>([]);

  ngOnInit() {
    const slug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.api.getPublic<any[]>(slug, 'news').subscribe((data) => this.news.set(data));
  }
}
