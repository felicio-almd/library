import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookCategory } from '../book-category.model';
import { BookCategoryService } from '../service/book-category.service';

const bookCategoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IBookCategory> => {
  const id = route.params.id;
  if (id) {
    return inject(BookCategoryService)
      .find(id)
      .pipe(
        mergeMap((bookCategory: HttpResponse<IBookCategory>) => {
          if (bookCategory.body) {
            return of(bookCategory.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default bookCategoryResolve;
