import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookLocation } from '../book-location.model';
import { BookLocationService } from '../service/book-location.service';

const bookLocationResolve = (route: ActivatedRouteSnapshot): Observable<null | IBookLocation> => {
  const id = route.params.id;
  if (id) {
    return inject(BookLocationService)
      .find(id)
      .pipe(
        mergeMap((bookLocation: HttpResponse<IBookLocation>) => {
          if (bookLocation.body) {
            return of(bookLocation.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default bookLocationResolve;
