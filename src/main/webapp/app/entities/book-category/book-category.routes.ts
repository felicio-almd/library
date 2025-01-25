import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BookCategoryResolve from './route/book-category-routing-resolve.service';

const bookCategoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/book-category.component').then(m => m.BookCategoryComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/book-category-detail.component').then(m => m.BookCategoryDetailComponent),
    resolve: {
      bookCategory: BookCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/book-category-update.component').then(m => m.BookCategoryUpdateComponent),
    resolve: {
      bookCategory: BookCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/book-category-update.component').then(m => m.BookCategoryUpdateComponent),
    resolve: {
      bookCategory: BookCategoryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bookCategoryRoute;
