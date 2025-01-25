import { IBookLocation, NewBookLocation } from './book-location.model';

export const sampleWithRequiredData: IBookLocation = {
  id: 14487,
  aisle: 'loftily',
  shelf: 'indeed',
};

export const sampleWithPartialData: IBookLocation = {
  id: 4888,
  aisle: 'after',
  shelf: 'hm rich',
};

export const sampleWithFullData: IBookLocation = {
  id: 13235,
  aisle: 'sure-footed',
  shelf: 'than though',
};

export const sampleWithNewData: NewBookLocation = {
  aisle: 'that minus',
  shelf: 'developmental superior oh',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
