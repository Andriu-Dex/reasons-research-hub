import { Directive, ElementRef, inject, OnDestroy } from '@angular/core';

@Directive({
  selector: '.reveal',
  standalone: true
})
export class RevealDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 0px 0px' }
    );

    this.observer.observe(this.el.nativeElement);

    setTimeout(() => {
      const nativeEl = this.el.nativeElement as HTMLElement;
      const rect = nativeEl.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        nativeEl.classList.add('revealed');
        this.observer?.unobserve(nativeEl);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
