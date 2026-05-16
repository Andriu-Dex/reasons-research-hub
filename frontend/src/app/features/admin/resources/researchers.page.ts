import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-researchers-admin-page',
  imports: [ResourceEditorComponent],
  templateUrl: './researchers.page.html',
  styleUrl: './styles/researchers.page.css'
})
export class ResearchersAdminPage {
  readonly template = {
    fullName: '',
    position: '',
    biography: '',
    institutionalEmail: '',
    orcid: null,
    photoMediaId: null,
    isFeatured: false,
    status: 'DRAFT',
    displayOrder: 0,
    socialLinks: []
  };
}
