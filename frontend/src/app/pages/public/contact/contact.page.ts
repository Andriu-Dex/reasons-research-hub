import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.page.html',
  styleUrl: './contact.page.css'
})
export class ContactPage {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private toastService: ToastService) {}

  submit(form: NgForm): void {
    if (form.invalid) {
      this.toastService.error('Campos incompletos', 'Completa los datos obligatorios.');
      return;
    }

    this.toastService.success('Mensaje enviado', 'Gracias por escribirnos. Te contactaremos pronto.');
    form.resetForm();
  }
}
