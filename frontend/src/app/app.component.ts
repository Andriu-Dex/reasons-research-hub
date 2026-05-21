import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, ThemeToggleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initialize();
  }
}
