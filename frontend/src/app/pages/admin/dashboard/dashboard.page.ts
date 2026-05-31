import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardPayload, AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPage implements OnInit {
  dashboard: DashboardPayload | null = null;
  isLoading = true;

  constructor(
    private adminApi: AdminApiService,
    private authService: AuthService
  ) {}

  get adminName(): string {
    const fullName = this.authService.session()?.admin.fullName;
    return fullName?.split(' ')[0] || 'Administrador';
  }

  ngOnInit(): void {
    this.adminApi.getDashboard().subscribe({
      next: (dashboard) => {
        this.dashboard = dashboard;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }
}
