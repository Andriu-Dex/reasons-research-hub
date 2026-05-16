import { Injectable } from '@angular/core';
import type { SiteSettings } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  apply(settings?: SiteSettings | null) {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty('--color-primary', settings.colorPrimary);
    root.style.setProperty('--color-secondary', settings.colorSecondary);
    root.style.setProperty('--color-background', settings.colorBackground);
    root.style.setProperty('--color-surface', settings.colorSurface);
    root.style.setProperty('--color-text', settings.colorText);
  }
}
