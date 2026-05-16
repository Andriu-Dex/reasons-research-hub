import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-news-admin-page',
  imports: [ResourceEditorComponent],
  templateUrl: './news.page.html',
  styleUrl: './styles/news.page.css'
})
export class NewsAdminPage {
  readonly template = {
    title: '',
    slug: '',
    summary: '',
    content: '',
    mainMediaId: null,
    publishedAt: new Date().toISOString().slice(0, 10),
    projectId: null,
    isFeatured: false,
    status: 'DRAFT',
    displayOrder: 0
  };
}
