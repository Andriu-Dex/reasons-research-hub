import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[bioFlip]',
  standalone: true
})
export class BioFlipDirective {
  private readonly el = inject(ElementRef);
  private flipped = false;

  @HostListener('click')
  onClick(): void {
    this.flipped = !this.flipped;
    const card = this.el.nativeElement as HTMLElement;
    if (this.flipped) {
      card.classList.add('is-flipped');
    } else {
      card.classList.remove('is-flipped');
    }
  }
}
