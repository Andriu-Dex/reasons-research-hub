import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-projects-admin-page',
  imports: [ResourceEditorComponent],
  templateUrl: './projects.page.html',
  styleUrl: './styles/projects.page.css'
})
export class ProjectsAdminPage {
  readonly template = {
    title: '',
    slug: '',
    description: '',
    objectives: '',
    results: null,
    mainMediaId: null,
    projectStatus: 'IN_PROGRESS',
    isFeatured: false,
    status: 'DRAFT',
    displayOrder: 0,
    researcherIds: [],
    researchLineIds: []
  };
}
