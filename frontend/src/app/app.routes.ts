import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'admin/:tenantSlug',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then((m) => m.DashboardPage) }
    ]
  },
  {
    path: ':tenantSlug',
    loadComponent: () => import('./layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public/home/home.page').then((m) => m.HomePage) },
      { path: 'nosotros', loadComponent: () => import('./pages/public/about/about.page').then((m) => m.AboutPage) },
      { path: 'investigacion', loadComponent: () => import('./pages/public/research/research.page').then((m) => m.ResearchPage) },
      { path: 'investigadores', loadComponent: () => import('./pages/public/researchers/researchers.page').then((m) => m.ResearchersPage) },
      { path: 'noticias', loadComponent: () => import('./pages/public/news/news.page').then((m) => m.NewsPage) },
      { path: 'contacto', loadComponent: () => import('./pages/public/contact/contact.page').then((m) => m.ContactPage) }
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'uta-reasons' },
  { path: '**', redirectTo: 'uta-reasons' }
];
