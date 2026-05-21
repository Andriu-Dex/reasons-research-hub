import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'reasons-theme';

type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly darkMode = signal(false);
  readonly isDarkMode = this.darkMode.asReadonly();

  initialize(): void {
    const stored = this.readStorage();
    if (stored) {
      this.applyTheme(stored === 'dark', false);
      return;
    }

    const prefersDark = this.getPrefersDark();
    this.applyTheme(prefersDark, false);
  }

  toggleTheme(): void {
    this.applyTheme(!this.darkMode());
  }

  private applyTheme(isDark: boolean, persist = true): void {
    this.darkMode.set(isDark);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
    if (persist) {
      this.writeStorage(isDark ? 'dark' : 'light');
    }
  }

  private readStorage(): ThemeMode | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  }

  private writeStorage(value: ThemeMode): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, value);
  }

  private getPrefersDark(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }
}
