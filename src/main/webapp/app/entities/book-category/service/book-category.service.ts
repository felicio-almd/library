import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookCategory, NewBookCategory } from '../book-category.model';

export type PartialUpdateBookCategory = Partial<IBookCategory> & Pick<IBookCategory, 'id'>;

export type EntityResponseType = HttpResponse<IBookCategory>;
export type EntityArrayResponseType = HttpResponse<IBookCategory[]>;

@Injectable({ providedIn: 'root' })
export class BookCategoryService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/book-categories');

  create(bookCategory: NewBookCategory): Observable<EntityResponseType> {
    return this.http.post<IBookCategory>(this.resourceUrl, bookCategory, { observe: 'response' });
  }

  update(bookCategory: IBookCategory): Observable<EntityResponseType> {
    return this.http.put<IBookCategory>(`${this.resourceUrl}/${this.getBookCategoryIdentifier(bookCategory)}`, bookCategory, {
      observe: 'response',
    });
  }

  partialUpdate(bookCategory: PartialUpdateBookCategory): Observable<EntityResponseType> {
    return this.http.patch<IBookCategory>(`${this.resourceUrl}/${this.getBookCategoryIdentifier(bookCategory)}`, bookCategory, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookCategory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookCategory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookCategoryIdentifier(bookCategory: Pick<IBookCategory, 'id'>): number {
    return bookCategory.id;
  }

  compareBookCategory(o1: Pick<IBookCategory, 'id'> | null, o2: Pick<IBookCategory, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookCategoryIdentifier(o1) === this.getBookCategoryIdentifier(o2) : o1 === o2;
  }

  addBookCategoryToCollectionIfMissing<Type extends Pick<IBookCategory, 'id'>>(
    bookCategoryCollection: Type[],
    ...bookCategoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const bookCategories: Type[] = bookCategoriesToCheck.filter(isPresent);
    if (bookCategories.length > 0) {
      const bookCategoryCollectionIdentifiers = bookCategoryCollection.map(bookCategoryItem =>
        this.getBookCategoryIdentifier(bookCategoryItem),
      );
      const bookCategoriesToAdd = bookCategories.filter(bookCategoryItem => {
        const bookCategoryIdentifier = this.getBookCategoryIdentifier(bookCategoryItem);
        if (bookCategoryCollectionIdentifiers.includes(bookCategoryIdentifier)) {
          return false;
        }
        bookCategoryCollectionIdentifiers.push(bookCategoryIdentifier);
        return true;
      });
      return [...bookCategoriesToAdd, ...bookCategoryCollection];
    }
    return bookCategoryCollection;
  }
}
