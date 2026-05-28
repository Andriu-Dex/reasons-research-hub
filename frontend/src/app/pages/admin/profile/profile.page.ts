import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminProfile, AdminApiService } from '../../../core/services/admin-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.css'
})
export class ProfilePage implements OnInit {
  profile: AdminProfile | null = null;
  password = { currentPassword: '', newPassword: '' };
  isSaving = false;

  constructor(
    private adminApi: AdminApiService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.adminApi.getProfile().subscribe({ next: (profile) => (this.profile = profile) });
  }

  saveProfile(): void {
    if (!this.profile) return;
    this.isSaving = true;
    this.adminApi.updateProfile({ fullName: this.profile.fullName, email: this.profile.email }).subscribe({
      next: (profile) => {
        this.profile = profile;
        this.authService.updateStoredAdmin({ fullName: profile.fullName, email: profile.email });
        this.isSaving = false;
        this.toastService.success('Perfil actualizado');
      },
      error: () => {
        this.isSaving = false;
        this.toastService.error('No se pudo actualizar');
      }
    });
  }

  savePassword(): void {
    this.adminApi.updatePassword(this.password).subscribe({
      next: () => {
        this.password = { currentPassword: '', newPassword: '' };
        this.toastService.success('Contrasena actualizada');
      },
      error: () => this.toastService.error('No se pudo cambiar la contrasena')
    });
  }
}
