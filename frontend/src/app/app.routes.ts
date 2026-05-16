import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/super-admin.guard';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () => import('./features/admin/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'admin/organizations',
    canActivate: [authGuard, superAdminGuard],
    loadComponent: () => import('./features/admin/organizations/organizations.page').then((m) => m.OrganizationsPage)
  },
  {
    path: 'admin/:tenantSlug',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.page').then((m) => m.DashboardPage) },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings.page').then((m) => m.SettingsPage) },
      { path: 'home', loadComponent: () => import('./features/admin/home-editor/home-editor.page').then((m) => m.HomeEditorPage) },
      { path: 'about', loadComponent: () => import('./features/admin/about-editor/about-editor.page').then((m) => m.AboutEditorPage) },
      { path: 'research-lines', loadComponent: () => import('./features/admin/resources/research-lines.page').then((m) => m.ResearchLinesPage) },
      { path: 'researchers', loadComponent: () => import('./features/admin/resources/researchers.page').then((m) => m.ResearchersAdminPage) },
      { path: 'projects', loadComponent: () => import('./features/admin/resources/projects.page').then((m) => m.ProjectsAdminPage) },
      { path: 'publications', loadComponent: () => import('./features/admin/resources/publications.page').then((m) => m.PublicationsAdminPage) },
      { path: 'news', loadComponent: () => import('./features/admin/resources/news.page').then((m) => m.NewsAdminPage) },
      { path: 'contact', loadComponent: () => import('./features/admin/resources/contact.page').then((m) => m.ContactAdminPage) },
      { path: 'profile', loadComponent: () => import('./features/admin/profile/profile.page').then((m) => m.ProfilePage) }
    ]
  },
  {
    path: ':tenantSlug',
    loadComponent: () => import('./features/public/layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./features/public/home/home.page').then((m) => m.HomePage) },
      { path: 'nosotros', loadComponent: () => import('./features/public/about/about.page').then((m) => m.AboutPage) },
      { path: 'investigacion', loadComponent: () => import('./features/public/research/research.page').then((m) => m.ResearchPage) },
      { path: 'investigadores', loadComponent: () => import('./features/public/researchers/researchers.page').then((m) => m.ResearchersPage) },
      { path: 'noticias', loadComponent: () => import('./features/public/news/news.page').then((m) => m.NewsPage) },
      { path: 'contacto', loadComponent: () => import('./features/public/contact/contact.page').then((m) => m.ContactPage) }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'uta-reasons' },
  { path: '**', redirectTo: 'uta-reasons' }
];
