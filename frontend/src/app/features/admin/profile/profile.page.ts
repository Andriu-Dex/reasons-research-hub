import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile.page.html',
  styleUrl: './styles/profile.page.css'
})
export class ProfilePage {
  readonly admin = inject(AuthService).admin;
}
