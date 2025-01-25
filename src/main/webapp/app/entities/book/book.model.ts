import { IBookLocation } from 'app/entities/book-location/book-location.model';
import { IAuthor } from 'app/entities/author/author.model';
import { IBookCategory } from 'app/entities/book-category/book-category.model';

export interface IBook {
  id: number;
  title?: string | null;
  publicationYear?: number | null;
  totalCopies?: number | null;
  availableCopies?: number | null;
  location?: IBookLocation | null;
  authors?: IAuthor | null;
  categories?: IBookCategory | null;
}

export type NewBook = Omit<IBook, 'id'> & { id: null };
