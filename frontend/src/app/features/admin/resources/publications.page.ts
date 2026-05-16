import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-publications-admin-page',
  imports: [ResourceEditorComponent],
  templateUrl: './publications.page.html',
  styleUrl: './styles/publications.page.css'
})
export class PublicationsAdminPage {
  readonly template = {
    title: '',
    slug: '',
    abstract: '',
    citation: '',
    coverMediaId: null,
    doi: null,
    externalLink: null,
    projectId: null,
    isFeatured: false,
    status: 'DRAFT',
    displayOrder: 0,
    publishedAt: null,
    authorIds: []
  };
}
