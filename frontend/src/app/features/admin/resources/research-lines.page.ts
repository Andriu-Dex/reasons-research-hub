import { Component } from '@angular/core';
import { ResourceEditorComponent } from '../shared/resource-editor.component';

@Component({
  selector: 'app-research-lines-page',
  imports: [ResourceEditorComponent],
  templateUrl: './research-lines.page.html',
  styleUrl: './styles/research-lines.page.css'
})
export class ResearchLinesPage {
  readonly template = { title: '', description: '', icon: 'BrainCircuit', status: 'DRAFT', displayOrder: 0 };
}
