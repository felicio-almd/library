import { IBookCategory, NewBookCategory } from './book-category.model';

export const sampleWithRequiredData: IBookCategory = {
  id: 18881,
  name: 'except kit upliftingly',
};

export const sampleWithPartialData: IBookCategory = {
  id: 13064,
  name: 'now rejoin',
};

export const sampleWithFullData: IBookCategory = {
  id: 20428,
  name: 'consequently concerning institute',
  description: 'bah infinite',
};

export const sampleWithNewData: NewBookCategory = {
  name: 'midst sans',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
