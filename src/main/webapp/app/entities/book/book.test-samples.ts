import { IBook, NewBook } from './book.model';

export const sampleWithRequiredData: IBook = {
  id: 3991,
  title: 'blue regal',
  publicationYear: 21315,
  totalCopies: 8211,
  availableCopies: 19027,
};

export const sampleWithPartialData: IBook = {
  id: 24512,
  title: 'yet as',
  publicationYear: 17069,
  totalCopies: 10868,
  availableCopies: 13195,
};

export const sampleWithFullData: IBook = {
  id: 8637,
  title: 'sniff',
  publicationYear: 20142,
  totalCopies: 8807,
  availableCopies: 21756,
};

export const sampleWithNewData: NewBook = {
  title: 'taxicab nor',
  publicationYear: 12703,
  totalCopies: 32032,
  availableCopies: 14367,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
