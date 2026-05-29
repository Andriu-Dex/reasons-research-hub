import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { superAdminGuard } from './core/guards/super-admin.guard';

const publicChildren: Routes = [
  { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public/home/home.page').then((m) => m.HomePage) },
  {
    path: 'nosotros',
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public/about/about.page').then((m) => m.AboutPage) },
      { path: 'quienes-somos', loadComponent: () => import('./pages/public/about/about.page').then((m) => m.AboutPage) },
      { path: 'equipo', loadComponent: () => import('./pages/public/team/team.page').then((m) => m.TeamPage) }
    ]
  },
  {
    path: 'investigacion',
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public/research/research.page').then((m) => m.ResearchPage) },
      { path: 'lineas', loadComponent: () => import('./pages/public/research-lines/research-lines.page').then((m) => m.ResearchLinesPublicPage) },
      { path: 'libros', loadComponent: () => import('./pages/public/publications/publications.page').then((m) => m.PublicationsPage), data: { mode: 'books' } },
      { path: 'articulos-cientificos', loadComponent: () => import('./pages/public/publications/publications.page').then((m) => m.PublicationsPage), data: { mode: 'articles' } },
      { path: 'proyectos-academicos', loadComponent: () => import('./pages/public/projects/projects.page').then((m) => m.ProjectsPage), data: { mode: 'academic' } },
      { path: 'proyectos-investigacion', loadComponent: () => import('./pages/public/projects/projects.page').then((m) => m.ProjectsPage), data: { mode: 'research' } }
    ]
  },
  { path: 'investigadores', loadComponent: () => import('./pages/public/researchers/researchers.page').then((m) => m.ResearchersPage) },
  {
    path: 'noticias',
    children: [
      { path: '', pathMatch: 'full', loadComponent: () => import('./pages/public/news/news.page').then((m) => m.NewsPage) },
      { path: 'novedades', loadComponent: () => import('./pages/public/news-category/news-category.page').then((m) => m.NewsCategoryPage), data: { category: 'updates' } },
      { path: 'eventos', loadComponent: () => import('./pages/public/news-category/news-category.page').then((m) => m.NewsCategoryPage), data: { category: 'events' } },
      { path: 'convenios-cooperacion', loadComponent: () => import('./pages/public/news-category/news-category.page').then((m) => m.NewsCategoryPage), data: { category: 'agreements' } }
    ]
  },
  { path: 'contacto', loadComponent: () => import('./pages/public/contact/contact.page').then((m) => m.ContactPage) }
];

const publicLayoutRoute = (path: string): Routes[number] => ({
  path,
  loadComponent: () => import('./layouts/public-layout/public-layout.component').then((m) => m.PublicLayoutComponent),
  children: publicChildren
});

export const routes: Routes = [
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/login.page').then((m) => m.LoginPage)
  },
  {
    path: 'admin/organizations',
    canActivate: [superAdminGuard],
    loadComponent: () => import('./pages/admin/organizations/organizations.page').then((m) => m.OrganizationsPage)
  },
  {
    path: 'admin/:tenantSlug',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then((m) => m.DashboardPage) },
      { path: 'settings', loadComponent: () => import('./pages/admin/settings/settings.page').then((m) => m.SettingsPage) },
      { path: 'home', loadComponent: () => import('./pages/admin/home/home-admin.page').then((m) => m.HomeAdminPage) },
      { path: 'about', loadComponent: () => import('./pages/admin/about/about-admin.page').then((m) => m.AboutAdminPage) },
      { path: 'research-lines', loadComponent: () => import('./pages/admin/research-lines/research-lines.page').then((m) => m.ResearchLinesPage) },
      { path: 'researchers', loadComponent: () => import('./pages/admin/researchers/researchers-admin.page').then((m) => m.ResearchersAdminPage) },
      { path: 'projects', loadComponent: () => import('./pages/admin/projects/projects-admin.page').then((m) => m.ProjectsAdminPage) },
      { path: 'authors', loadComponent: () => import('./pages/admin/authors/authors-admin.page').then((m) => m.AuthorsAdminPage) },
      { path: 'publications', loadComponent: () => import('./pages/admin/publications/publications-admin.page').then((m) => m.PublicationsAdminPage) },
      { path: 'news', loadComponent: () => import('./pages/admin/news/news-admin.page').then((m) => m.NewsAdminPage) },
      { path: 'contact', loadComponent: () => import('./pages/admin/contact/contact-admin.page').then((m) => m.ContactAdminPage) },
      { path: 'media', loadComponent: () => import('./pages/admin/media/media-admin.page').then((m) => m.MediaAdminPage) },
      { path: 'profile', loadComponent: () => import('./pages/admin/profile/profile.page').then((m) => m.ProfilePage) }
    ]
  },
  publicLayoutRoute(''),
  publicLayoutRoute(':tenantSlug'),
  { path: '**', redirectTo: 'uta-reasons' }
];
