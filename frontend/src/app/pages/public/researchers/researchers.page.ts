import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-researchers-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './researchers.page.html',
  styleUrl: './researchers.page.css'
})
export class ResearchersPage {}
