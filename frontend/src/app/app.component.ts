import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastContainerComponent } from './shared/toast/toast-container.component';
import { SplashScreenComponent } from './shared/splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, SplashScreenComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeService.initialize();
  }
}
