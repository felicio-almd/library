import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBorrow, NewBorrow } from '../borrow.model';

export type PartialUpdateBorrow = Partial<IBorrow> & Pick<IBorrow, 'id'>;

type RestOf<T extends IBorrow | NewBorrow> = Omit<T, 'borrowDateTime' | 'returnDateTime'> & {
  borrowDateTime?: string | null;
  returnDateTime?: string | null;
};

export type RestBorrow = RestOf<IBorrow>;

export type NewRestBorrow = RestOf<NewBorrow>;

export type PartialUpdateRestBorrow = RestOf<PartialUpdateBorrow>;

export type EntityResponseType = HttpResponse<IBorrow>;
export type EntityArrayResponseType = HttpResponse<IBorrow[]>;

@Injectable({ providedIn: 'root' })
export class BorrowService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/borrows');

  create(borrow: NewBorrow): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrow);
    return this.http
      .post<RestBorrow>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(borrow: IBorrow): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrow);
    return this.http
      .put<RestBorrow>(`${this.resourceUrl}/${this.getBorrowIdentifier(borrow)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(borrow: PartialUpdateBorrow): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(borrow);
    return this.http
      .patch<RestBorrow>(`${this.resourceUrl}/${this.getBorrowIdentifier(borrow)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestBorrow>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestBorrow[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBorrowIdentifier(borrow: Pick<IBorrow, 'id'>): number {
    return borrow.id;
  }

  compareBorrow(o1: Pick<IBorrow, 'id'> | null, o2: Pick<IBorrow, 'id'> | null): boolean {
    return o1 && o2 ? this.getBorrowIdentifier(o1) === this.getBorrowIdentifier(o2) : o1 === o2;
  }

  addBorrowToCollectionIfMissing<Type extends Pick<IBorrow, 'id'>>(
    borrowCollection: Type[],
    ...borrowsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const borrows: Type[] = borrowsToCheck.filter(isPresent);
    if (borrows.length > 0) {
      const borrowCollectionIdentifiers = borrowCollection.map(borrowItem => this.getBorrowIdentifier(borrowItem));
      const borrowsToAdd = borrows.filter(borrowItem => {
        const borrowIdentifier = this.getBorrowIdentifier(borrowItem);
        if (borrowCollectionIdentifiers.includes(borrowIdentifier)) {
          return false;
        }
        borrowCollectionIdentifiers.push(borrowIdentifier);
        return true;
      });
      return [...borrowsToAdd, ...borrowCollection];
    }
    return borrowCollection;
  }

  protected convertDateFromClient<T extends IBorrow | NewBorrow | PartialUpdateBorrow>(borrow: T): RestOf<T> {
    return {
      ...borrow,
      borrowDateTime: borrow.borrowDateTime?.toJSON() ?? null,
      returnDateTime: borrow.returnDateTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restBorrow: RestBorrow): IBorrow {
    return {
      ...restBorrow,
      borrowDateTime: restBorrow.borrowDateTime ? dayjs(restBorrow.borrowDateTime) : undefined,
      returnDateTime: restBorrow.returnDateTime ? dayjs(restBorrow.returnDateTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestBorrow>): HttpResponse<IBorrow> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestBorrow[]>): HttpResponse<IBorrow[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
