import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAuthor, NewAuthor } from '../author.model';

export type PartialUpdateAuthor = Partial<IAuthor> & Pick<IAuthor, 'id'>;

type RestOf<T extends IAuthor | NewAuthor> = Omit<T, 'birthDate'> & {
  birthDate?: string | null;
};

export type RestAuthor = RestOf<IAuthor>;

export type NewRestAuthor = RestOf<NewAuthor>;

export type PartialUpdateRestAuthor = RestOf<PartialUpdateAuthor>;

export type EntityResponseType = HttpResponse<IAuthor>;
export type EntityArrayResponseType = HttpResponse<IAuthor[]>;

@Injectable({ providedIn: 'root' })
export class AuthorService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/authors');

  create(author: NewAuthor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(author);
    return this.http
      .post<RestAuthor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(author: IAuthor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(author);
    return this.http
      .put<RestAuthor>(`${this.resourceUrl}/${this.getAuthorIdentifier(author)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(author: PartialUpdateAuthor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(author);
    return this.http
      .patch<RestAuthor>(`${this.resourceUrl}/${this.getAuthorIdentifier(author)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAuthor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAuthor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAuthorIdentifier(author: Pick<IAuthor, 'id'>): number {
    return author.id;
  }

  compareAuthor(o1: Pick<IAuthor, 'id'> | null, o2: Pick<IAuthor, 'id'> | null): boolean {
    return o1 && o2 ? this.getAuthorIdentifier(o1) === this.getAuthorIdentifier(o2) : o1 === o2;
  }

  addAuthorToCollectionIfMissing<Type extends Pick<IAuthor, 'id'>>(
    authorCollection: Type[],
    ...authorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const authors: Type[] = authorsToCheck.filter(isPresent);
    if (authors.length > 0) {
      const authorCollectionIdentifiers = authorCollection.map(authorItem => this.getAuthorIdentifier(authorItem));
      const authorsToAdd = authors.filter(authorItem => {
        const authorIdentifier = this.getAuthorIdentifier(authorItem);
        if (authorCollectionIdentifiers.includes(authorIdentifier)) {
          return false;
        }
        authorCollectionIdentifiers.push(authorIdentifier);
        return true;
      });
      return [...authorsToAdd, ...authorCollection];
    }
    return authorCollection;
  }

  protected convertDateFromClient<T extends IAuthor | NewAuthor | PartialUpdateAuthor>(author: T): RestOf<T> {
    return {
      ...author,
      birthDate: author.birthDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAuthor: RestAuthor): IAuthor {
    return {
      ...restAuthor,
      birthDate: restAuthor.birthDate ? dayjs(restAuthor.birthDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAuthor>): HttpResponse<IAuthor> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAuthor[]>): HttpResponse<IAuthor[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
