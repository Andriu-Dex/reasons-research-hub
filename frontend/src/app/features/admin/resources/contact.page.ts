import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-contact-admin-page',
  imports: [ResourceEditorComponent],
  templateUrl: './contact.page.html',
  styleUrl: './styles/contact.page.css'
})
export class ContactAdminPage {
  readonly template = { type: 'email', value: '', label: '', isEnabled: true, displayOrder: 0 };
}
