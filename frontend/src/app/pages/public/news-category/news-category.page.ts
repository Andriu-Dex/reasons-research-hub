import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NewsItem } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

type NewsCategory = 'updates' | 'events' | 'agreements';

interface NewsCategoryConfig {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  keywords: string[];
}

const CATEGORY_CONFIG: Record<NewsCategory, NewsCategoryConfig> = {
  updates: {
    eyebrow: 'Novedades',
    title: 'Novedades académicas y resultados institucionales.',
    description: 'Comunicados, logros y actualizaciones recientes para la comunidad académica.',
    emptyMessage: 'Aún no hay novedades publicadas.',
    keywords: []
  },
  events: {
    eyebrow: 'Eventos',
    title: 'Eventos, congresos y encuentros académicos.',
    description: 'Actividades abiertas, simposios, seminarios y espacios de divulgación científica.',
    emptyMessage: 'Aún no hay eventos publicados.',
    keywords: ['evento', 'congreso', 'simposio', 'seminario', 'taller', 'jornada', 'encuentro']
  },
  agreements: {
    eyebrow: 'Convenios de cooperación',
    title: 'Alianzas y convenios para ampliar impacto académico.',
    description: 'Convenios, redes de colaboración y acuerdos institucionales publicados por la organización.',
    emptyMessage: 'Aún no hay convenios de cooperación publicados.',
    keywords: ['convenio', 'cooperacion', 'cooperación', 'colaboracion', 'colaboración', 'alianza', 'acuerdo']
  }
};

@Component({
  selector: 'app-news-category-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-category.page.html',
  styleUrl: './news-category.page.css'
})
export class NewsCategoryPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  category: NewsCategory = 'updates';
  news: NewsItem[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get config(): NewsCategoryConfig {
    return CATEGORY_CONFIG[this.category];
  }

  ngOnInit(): void {
    const category = this.route.snapshot.data['category'];
    this.category = category === 'events' || category === 'agreements' ? category : 'updates';
    this.publicContentService
      .getNews(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (news) => {
          this.news = this.filterNews(news);
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private filterNews(news: NewsItem[]): NewsItem[] {
    if (!this.config.keywords.length) return news;
    return news.filter((item) => {
      const source = `${item.title} ${item.summary} ${item.content}`.toLowerCase();
      return this.config.keywords.some((keyword) => source.includes(keyword));
    });
  }
}
