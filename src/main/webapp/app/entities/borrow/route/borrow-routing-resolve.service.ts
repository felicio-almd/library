import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBorrow } from '../borrow.model';
import { BorrowService } from '../service/borrow.service';

const borrowResolve = (route: ActivatedRouteSnapshot): Observable<null | IBorrow> => {
  const id = route.params.id;
  if (id) {
    return inject(BorrowService)
      .find(id)
      .pipe(
        mergeMap((borrow: HttpResponse<IBorrow>) => {
          if (borrow.body) {
            return of(borrow.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default borrowResolve;
