import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Researcher } from '../../../core/models/content.models';
import { PublicContentService } from '../../../core/services/public-content.service';
import { getRouteTenantSlug } from '../../../core/utils/route-tenant.util';

@Component({
  selector: 'app-researchers-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './researchers.page.html',
  styleUrl: './researchers.page.css'
})
export class ResearchersPage implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  researchers: Researcher[] = [];
  isLoading = true;
  hasError = false;

  searchTerm = '';
  activeFilter: 'ALL' | 'FEATURED' = 'ALL';
  currentPage = 1;
  pageSize = 6;
  selectedResearcher: Researcher | null = null;

  constructor(
    private route: ActivatedRoute,
    private publicContentService: PublicContentService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.publicContentService
      .getResearchers(getRouteTenantSlug(this.route))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (researchers) => {
          this.researchers = researchers;
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

  openModal(researcher: Researcher): void {
    this.selectedResearcher = researcher;
    document.body.style.overflow = 'hidden';
    this.changeDetectorRef.markForCheck();
  }

  closeModal(): void {
    this.selectedResearcher = null;
    document.body.style.overflow = '';
    this.changeDetectorRef.markForCheck();
  }

  get totalCount(): number {
    return this.researchers.length;
  }

  get featuredCount(): number {
    return this.researchers.filter(r => r.isFeatured).length;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onFilterChange();
  }

  getFilteredResearchers(): Researcher[] {
    return this.researchers.filter(researcher => {
      // 1. Tag Filter
      if (this.activeFilter === 'FEATURED' && !researcher.isFeatured) {
        return false;
      }

      // 2. Search Text
      if (this.searchTerm.trim() !== '') {
        const query = this.searchTerm.toLowerCase();
        const matchesName = researcher.fullName?.toLowerCase().includes(query);
        const matchesPosition = researcher.position?.toLowerCase().includes(query);
        const matchesBiography = researcher.biography?.toLowerCase().includes(query);
        return matchesName || matchesPosition || matchesBiography;
      }

      return true;
    });
  }

  get paginatedResearchers(): Researcher[] {
    const filtered = this.getFilteredResearchers();
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return filtered.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.getFilteredCount() / this.pageSize) || 1;
  }

  getFilteredCount(): number {
    return this.getFilteredResearchers().length;
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    const count = this.getFilteredCount();
    return end > count ? count : end;
  }

  getPagesArray(): number[] {
    const total = this.totalPages;
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  setFilter(filter: 'ALL' | 'FEATURED'): void {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.changeDetectorRef.markForCheck();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.changeDetectorRef.markForCheck();
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.changeDetectorRef.markForCheck();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.changeDetectorRef.markForCheck();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.changeDetectorRef.markForCheck();
    }
  }
}

