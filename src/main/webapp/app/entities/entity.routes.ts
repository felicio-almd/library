import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'libraryApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'author',
    data: { pageTitle: 'libraryApp.author.home.title' },
    loadChildren: () => import('./author/author.routes'),
  },
  {
    path: 'book',
    data: { pageTitle: 'libraryApp.book.home.title' },
    loadChildren: () => import('./book/book.routes'),
  },
  {
    path: 'book-category',
    data: { pageTitle: 'libraryApp.bookCategory.home.title' },
    loadChildren: () => import('./book-category/book-category.routes'),
  },
  {
    path: 'book-location',
    data: { pageTitle: 'libraryApp.bookLocation.home.title' },
    loadChildren: () => import('./book-location/book-location.routes'),
  },
  {
    path: 'borrow',
    data: { pageTitle: 'libraryApp.borrow.home.title' },
    loadChildren: () => import('./borrow/borrow.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
