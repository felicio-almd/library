import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BookResolve from './route/book-routing-resolve.service';

const bookRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/book.component').then(m => m.BookComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/book-detail.component').then(m => m.BookDetailComponent),
    resolve: {
      book: BookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/book-update.component').then(m => m.BookUpdateComponent),
    resolve: {
      book: BookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/book-update.component').then(m => m.BookUpdateComponent),
    resolve: {
      book: BookResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bookRoute;
