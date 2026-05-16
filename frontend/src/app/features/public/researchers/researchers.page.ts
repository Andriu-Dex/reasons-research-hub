import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Mail } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-researchers-page',
  imports: [LucideAngularModule],
  templateUrl: './researchers.page.html',
  styleUrl: './styles/researchers.page.css'
})
export class ResearchersPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);
  readonly mailIcon = Mail;
  readonly researchers = signal<any[]>([]);

  ngOnInit() {
    const slug = this.route.parent?.snapshot.paramMap.get('tenantSlug') ?? 'uta-reasons';
    this.api.getPublic<any[]>(slug, 'researchers').subscribe((data) => this.researchers.set(data));
  }
}
