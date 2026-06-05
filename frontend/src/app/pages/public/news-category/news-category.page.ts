import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewsCategory, NewsItem } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

type NewsPageCategory = 'updates' | 'events' | 'agreements';

interface NewsCategoryConfig {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
  categoryValue: NewsCategory;
  accentClass: string;
  icon: string;
}

const CATEGORY_CONFIG: Record<NewsPageCategory, NewsCategoryConfig> = {
  updates: {
    eyebrow: 'Novedades',
    title: 'Novedades académicas y resultados institucionales.',
    description: 'Comunicados, logros y actualizaciones recientes para la comunidad académica.',
    emptyMessage: 'Aún no hay novedades publicadas.',
    categoryValue: 'UPDATE',
    accentClass: 'updates',
    icon: 'campaign'
  },
  events: {
    eyebrow: 'Eventos',
    title: 'Eventos, congresos y encuentros académicos.',
    description: 'Actividades abiertas, simposios, seminarios y espacios de divulgación científica.',
    emptyMessage: 'Aún no hay eventos publicados.',
    categoryValue: 'EVENT',
    accentClass: 'events',
    icon: 'event'
  },
  agreements: {
    eyebrow: 'Convenios de cooperación',
    title: 'Alianzas y convenios para ampliar impacto académico.',
    description: 'Convenios, redes de colaboración y acuerdos institucionales publicados por la organización.',
    emptyMessage: 'Aún no hay convenios de cooperación publicados.',
    categoryValue: 'AGREEMENT',
    accentClass: 'agreements',
    icon: 'handshake'
  }
};

const PAGE_SIZE = 9;

@Component({
  selector: 'app-news-category-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './news-category.page.html',
  styleUrl: './news-category.page.css'
})
export class NewsCategoryPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  category: NewsPageCategory = 'updates';
  allNews: NewsItem[] = [];
  isLoading = true;
  hasError = false;

  searchTerm = '';
  currentPage = 1;
  selectedItem: NewsItem | null = null;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get config(): NewsCategoryConfig {
    return CATEGORY_CONFIG[this.category];
  }

  get filteredNews(): NewsItem[] {
    if (!this.searchTerm.trim()) return this.allNews;
    const q = this.searchTerm.toLowerCase();
    return this.allNews.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q)
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredNews.length / PAGE_SIZE);
  }

  get paginatedNews(): NewsItem[] {
    const start = (this.currentPage - 1) * PAGE_SIZE;
    return this.filteredNews.slice(start, start + PAGE_SIZE);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get totalCount(): number { return this.allNews.length; }
  get featuredCount(): number { return this.allNews.filter(n => n.isFeatured).length; }
  get latestDate(): string | null {
    if (!this.allNews.length) return null;
    return this.allNews.reduce((a, b) =>
      new Date(a.publishedAt) > new Date(b.publishedAt) ? a : b
    ).publishedAt;
  }

  ngOnInit(): void {
    const cat = this.route.snapshot.data['category'];
    this.category = cat === 'events' || cat === 'agreements' ? cat : 'updates';
    this.publicContentService
      .getNews(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (news) => {
          this.allNews = news.filter(item => item.newsCategory === this.config.categoryValue);
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

  onSearch(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openModal(item: NewsItem): void {
    this.selectedItem = item;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedItem = null;
    document.body.style.overflow = '';
  }

  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('nc-modal-backdrop')) {
      this.closeModal();
    }
  }
}
