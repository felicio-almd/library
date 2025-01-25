import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookLocation, NewBookLocation } from '../book-location.model';

export type PartialUpdateBookLocation = Partial<IBookLocation> & Pick<IBookLocation, 'id'>;

export type EntityResponseType = HttpResponse<IBookLocation>;
export type EntityArrayResponseType = HttpResponse<IBookLocation[]>;

@Injectable({ providedIn: 'root' })
export class BookLocationService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/book-locations');

  create(bookLocation: NewBookLocation): Observable<EntityResponseType> {
    return this.http.post<IBookLocation>(this.resourceUrl, bookLocation, { observe: 'response' });
  }

  update(bookLocation: IBookLocation): Observable<EntityResponseType> {
    return this.http.put<IBookLocation>(`${this.resourceUrl}/${this.getBookLocationIdentifier(bookLocation)}`, bookLocation, {
      observe: 'response',
    });
  }

  partialUpdate(bookLocation: PartialUpdateBookLocation): Observable<EntityResponseType> {
    return this.http.patch<IBookLocation>(`${this.resourceUrl}/${this.getBookLocationIdentifier(bookLocation)}`, bookLocation, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookLocation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookLocation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookLocationIdentifier(bookLocation: Pick<IBookLocation, 'id'>): number {
    return bookLocation.id;
  }

  compareBookLocation(o1: Pick<IBookLocation, 'id'> | null, o2: Pick<IBookLocation, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookLocationIdentifier(o1) === this.getBookLocationIdentifier(o2) : o1 === o2;
  }

  addBookLocationToCollectionIfMissing<Type extends Pick<IBookLocation, 'id'>>(
    bookLocationCollection: Type[],
    ...bookLocationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bookLocations: Type[] = bookLocationsToCheck.filter(isPresent);
    if (bookLocations.length > 0) {
      const bookLocationCollectionIdentifiers = bookLocationCollection.map(bookLocationItem =>
        this.getBookLocationIdentifier(bookLocationItem),
      );
      const bookLocationsToAdd = bookLocations.filter(bookLocationItem => {
        const bookLocationIdentifier = this.getBookLocationIdentifier(bookLocationItem);
        if (bookLocationCollectionIdentifiers.includes(bookLocationIdentifier)) {
          return false;
        }
        bookLocationCollectionIdentifiers.push(bookLocationIdentifier);
        return true;
      });
      return [...bookLocationsToAdd, ...bookLocationCollection];
    }
    return bookLocationCollection;
  }
}
