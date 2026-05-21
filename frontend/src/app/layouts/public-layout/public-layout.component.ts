import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.css'
})
export class PublicLayoutComponent {
  tenantSlug = 'uta-reasons';
  isMenuOpen = false;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      this.tenantSlug = params.get('tenantSlug') ?? 'uta-reasons';
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
