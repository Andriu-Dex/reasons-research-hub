import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import {
  AboutSettings,
  Author,
  ContactChannel,
  HomeSettings,
  MediaFile,
  NewsItem,
  Organization,
  Project,
  Publication,
  ResearchLine,
  Researcher,
  SiteSettings
} from '../models/content.models';
import { ApiService } from './api.service';
import { AdminSession } from './auth.service';

export type AdminResource =
  | 'contact-channels'
  | 'research-lines'
  | 'researchers'
  | 'projects'
  | 'authors'
  | 'publications'
  | 'news';

export interface DashboardPayload {
  counts: {
    researchers: number;
    projects: number;
    publications: number;
    news: number;
    researchLines: number;
    mediaFiles: number;
  };
  recentNews: Array<{ id: string; title: string; status: string; updatedAt: string }>;
}

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  role: AdminSession['admin']['role'];
  organizationId: string | null;
  organization?: { name: string; slug: string } | null;
}

export type ResourceMap = {
  'contact-channels': ContactChannel;
  'research-lines': ResearchLine;
  researchers: Researcher;
  projects: Project;
  authors: Author;
  publications: Publication;
  news: NewsItem;
};

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  readonly logoUrl = signal<string>('https://i.imgur.com/RARaC9j.png');

  constructor(private api: ApiService) {}

  getDashboard() {
    return this.api.get<DashboardPayload>('/admin/dashboard');
  }

  getSiteSettings() {
    return this.api.get<SiteSettings>('/admin/site-settings').pipe(
      tap((settings) => {
        if (settings?.logo?.url) {
          this.logoUrl.set(settings.logo.url);
        } else {
          this.logoUrl.set('https://i.imgur.com/RARaC9j.png');
        }
      })
    );
  }

  updateSiteSettings(body: Partial<SiteSettings>) {
    return this.api.put<SiteSettings>('/admin/site-settings', body).pipe(
      tap((settings) => {
        if (settings?.logo?.url) {
          this.logoUrl.set(settings.logo.url);
        } else {
          this.logoUrl.set('https://i.imgur.com/RARaC9j.png');
        }
      })
    );
  }

  getHomeSettings() {
    return this.api.get<HomeSettings>('/admin/home-settings');
  }

  updateHomeSettings(body: Partial<HomeSettings>) {
    return this.api.put<HomeSettings>('/admin/home-settings', body);
  }

  getAboutSettings() {
    return this.api.get<AboutSettings>('/admin/about-settings');
  }

  updateAboutSettings(body: Partial<AboutSettings>) {
    return this.api.put<AboutSettings>('/admin/about-settings', body);
  }

  list<T extends AdminResource>(resource: T) {
    return this.api.get<ResourceMap[T][]>(`/admin/${resource}`);
  }

  create<T extends AdminResource>(resource: T, body: Partial<ResourceMap[T]>) {
    return this.api.post<ResourceMap[T]>(`/admin/${resource}`, body);
  }

  update<T extends AdminResource>(resource: T, id: string, body: Partial<ResourceMap[T]>) {
    return this.api.put<ResourceMap[T]>(`/admin/${resource}/${id}`, body);
  }

  remove(resource: AdminResource, id: string) {
    return this.api.delete<void>(`/admin/${resource}/${id}`);
  }

  getMedia() {
    return this.api.get<MediaFile[]>('/admin/media');
  }

  uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post<MediaFile>('/admin/media/upload', formData);
  }

  deleteMedia(id: string) {
    return this.api.delete<void>(`/admin/media/${id}`);
  }

  getProfile() {
    return this.api.get<AdminProfile>('/admin/profile');
  }

  updateProfile(body: { fullName: string; email: string }) {
    return this.api.put<AdminProfile>('/admin/profile', body);
  }

  updatePassword(body: { currentPassword: string; newPassword: string }) {
    return this.api.put<void>('/admin/profile/password', body);
  }

  listOrganizations() {
    return this.api.get<Organization[]>('/admin/organizations');
  }

  createOrganization(body: Partial<Organization>) {
    return this.api.post<Organization>('/admin/organizations', body);
  }

  updateOrganization(id: string, body: Partial<Organization>) {
    return this.api.put<Organization>(`/admin/organizations/${id}`, body);
  }
}
