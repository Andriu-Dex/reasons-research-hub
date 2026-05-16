import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrl: './styles/dashboard.page.css'
})
export class DashboardPage {
  readonly admin = inject(AuthService).admin;
}
