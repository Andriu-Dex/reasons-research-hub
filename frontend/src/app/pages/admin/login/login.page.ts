import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  credentials = {
    email: '',
    password: ''
  };

  constructor(private toastService: ToastService) {}

  submit(form: NgForm): void {
    if (form.invalid) {
      this.toastService.error('Acceso incompleto', 'Ingresa tu correo y contrasena.');
      return;
    }

    this.toastService.info('Modo demo', 'La autenticacion aun no esta conectada.');
  }
}
