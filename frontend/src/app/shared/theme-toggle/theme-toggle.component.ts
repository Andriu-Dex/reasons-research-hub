import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [NgIf],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  constructor(private themeService: ThemeService) {}

  isDark(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
