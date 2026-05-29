import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

type PublicationsMode = 'books' | 'articles';

interface PublicationsViewConfig {
  eyebrow: string;
  title: string;
  description: string;
  emptyMessage: string;
}

const BOOK_KEYWORDS = ['libro', 'book', 'manual', 'capitulo', 'capítulo'];

@Component({
  selector: 'app-publications-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './publications.page.html',
  styleUrl: './publications.page.css'
})
export class PublicationsPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  mode: PublicationsMode = 'articles';
  publications: Publication[] = [];
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  get config(): PublicationsViewConfig {
    if (this.mode === 'books') {
      return {
        eyebrow: 'Libros',
        title: 'Libros, manuales y capítulos vinculados a la investigación.',
        description: 'Consulta producción académica de formato extendido registrada por la organización.',
        emptyMessage: 'Aún no hay libros publicados.'
      };
    }

    return {
      eyebrow: 'Artículos científicos',
      title: 'Producción científica para consulta académica.',
      description: 'Artículos, ponencias y resultados publicados por el equipo investigador.',
      emptyMessage: 'Aún no hay artículos científicos publicados.'
    };
  }

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'books' ? 'books' : 'articles';
    this.publicContentService
      .getPublications(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (publications) => {
          this.publications = this.filterPublications(publications);
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

  authorsOf(publication: Publication): string {
    return publication.authors?.map((entry) => entry.author.fullName).join(', ') || 'Autores no configurados';
  }

  private filterPublications(publications: Publication[]): Publication[] {
    if (this.mode === 'articles') {
      return publications.filter((publication) => !this.matchesKeywords(publication, BOOK_KEYWORDS));
    }

    return publications.filter((publication) => this.matchesKeywords(publication, BOOK_KEYWORDS));
  }

  private matchesKeywords(publication: Publication, keywords: string[]): boolean {
    const source = `${publication.title} ${publication.abstract} ${publication.citation}`.toLowerCase();
    return keywords.some((keyword) => source.includes(keyword));
  }
}
