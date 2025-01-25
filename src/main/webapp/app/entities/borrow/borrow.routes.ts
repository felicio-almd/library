import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import BorrowResolve from './route/borrow-routing-resolve.service';

const borrowRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/borrow.component').then(m => m.BorrowComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/borrow-detail.component').then(m => m.BorrowDetailComponent),
    resolve: {
      borrow: BorrowResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/borrow-update.component').then(m => m.BorrowUpdateComponent),
    resolve: {
      borrow: BorrowResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/borrow-update.component').then(m => m.BorrowUpdateComponent),
    resolve: {
      borrow: BorrowResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default borrowRoute;
