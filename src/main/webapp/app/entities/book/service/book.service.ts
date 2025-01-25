import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBook, NewBook } from '../book.model';

export type PartialUpdateBook = Partial<IBook> & Pick<IBook, 'id'>;

export type EntityResponseType = HttpResponse<IBook>;
export type EntityArrayResponseType = HttpResponse<IBook[]>;

@Injectable({ providedIn: 'root' })
export class BookService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/books');

  create(book: NewBook): Observable<EntityResponseType> {
    return this.http.post<IBook>(this.resourceUrl, book, { observe: 'response' });
  }

  update(book: IBook): Observable<EntityResponseType> {
    return this.http.put<IBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, book, { observe: 'response' });
  }

  partialUpdate(book: PartialUpdateBook): Observable<EntityResponseType> {
    return this.http.patch<IBook>(`${this.resourceUrl}/${this.getBookIdentifier(book)}`, book, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBook>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBook[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBookIdentifier(book: Pick<IBook, 'id'>): number {
    return book.id;
  }

  compareBook(o1: Pick<IBook, 'id'> | null, o2: Pick<IBook, 'id'> | null): boolean {
    return o1 && o2 ? this.getBookIdentifier(o1) === this.getBookIdentifier(o2) : o1 === o2;
  }

  addBookToCollectionIfMissing<Type extends Pick<IBook, 'id'>>(
    bookCollection: Type[],
    ...booksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const books: Type[] = booksToCheck.filter(isPresent);
    if (books.length > 0) {
      const bookCollectionIdentifiers = bookCollection.map(bookItem => this.getBookIdentifier(bookItem));
      const booksToAdd = books.filter(bookItem => {
        const bookIdentifier = this.getBookIdentifier(bookItem);
        if (bookCollectionIdentifiers.includes(bookIdentifier)) {
          return false;
        }
        bookCollectionIdentifiers.push(bookIdentifier);
        return true;
      });
      return [...booksToAdd, ...bookCollection];
    }
    return bookCollection;
  }
}
