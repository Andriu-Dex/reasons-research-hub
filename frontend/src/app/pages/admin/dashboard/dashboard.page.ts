import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardPayload, AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPage implements OnInit {
  dashboard: DashboardPayload | null = null;
  isLoading = true;

  constructor(private adminApi: AdminApiService) {}

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
