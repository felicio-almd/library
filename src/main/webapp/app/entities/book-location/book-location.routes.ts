import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BookLocationResolve from './route/book-location-routing-resolve.service';

const bookLocationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/book-location.component').then(m => m.BookLocationComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/book-location-detail.component').then(m => m.BookLocationDetailComponent),
    resolve: {
      bookLocation: BookLocationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/book-location-update.component').then(m => m.BookLocationUpdateComponent),
    resolve: {
      bookLocation: BookLocationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/book-location-update.component').then(m => m.BookLocationUpdateComponent),
    resolve: {
      bookLocation: BookLocationResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bookLocationRoute;
