import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/catalog',
    pathMatch: 'full'
  },
  {
    path: 'catalog',
    loadComponent: () => import('./components/public/movie-catalog/movie-catalog')
      .then(m => m.MovieCatalog)
  },
  {
    path: 'movie/:id',
    loadComponent: () => import('./components/public/movie-detail/movie-detail')
      .then(m => m.MovieDetail)
  },
  {
    path: 'admin/movies',
    loadComponent: () => import('./components/admin/movie-list/movie-list')
      .then(m => m.MovieList)
  },
  {
    path: 'admin/movies/new',
    loadComponent: () => import('./components/admin/movie-form/movie-form')
      .then(m => m.MovieForm)
  },
  {
    path: 'admin/movies/edit/:id',
    loadComponent: () => import('./components/admin/movie-form/movie-form')
      .then(m => m.MovieForm)
  },
  {
    path: '**',
    redirectTo: '/catalog'
  }
];