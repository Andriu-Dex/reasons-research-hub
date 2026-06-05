import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  AboutSettings,
  ContactChannel,
  HomePayload,
  NewsItem,
  Project,
  Publication,
  ResearchLine,
  Researcher,
  SiteSettings,
  SocialLink
} from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class PublicContentService {
  constructor(private api: ApiService) {}

  getCurrentTenant() {
    return this.api.get<{ id: string; slug: string; name: string; primaryDomain?: string | null }>('/tenant/current');
  }

  getSiteSettings(tenantSlug: string) {
    return this.api.get<SiteSettings | null>(`/${tenantSlug}/site-settings`);
  }

  getHome(tenantSlug: string) {
    return this.api.get<HomePayload>(`/${tenantSlug}/home`);
  }

  getAbout(tenantSlug: string) {
    return this.api.get<AboutSettings | null>(`/${tenantSlug}/about`);
  }

  getResearchLines(tenantSlug: string) {
    return this.api.get<ResearchLine[]>(`/${tenantSlug}/research-lines`);
  }

  getResearchers(tenantSlug: string) {
    return this.api.get<Researcher[]>(`/${tenantSlug}/researchers`);
  }

  getProjects(tenantSlug: string) {
    return this.api.get<Project[]>(`/${tenantSlug}/projects`);
  }

  getPublications(tenantSlug: string) {
    return this.api.get<Publication[]>(`/${tenantSlug}/publications`);
  }

  getNews(tenantSlug: string) {
    return this.api.get<NewsItem[]>(`/${tenantSlug}/news`);
  }

  getContactChannels(tenantSlug: string) {
    return this.api.get<ContactChannel[]>(`/${tenantSlug}/contact-channels`);
  }

  sendContactMessage(tenantSlug: string, body: {
    name: string;
    email: string;
    subject: string;
    message: string;
    turnstileToken?: string;
  }) {
    return this.api.post<{ message: string }>(`/${tenantSlug}/contact`, body);
  }
}
