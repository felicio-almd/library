import dayjs from 'dayjs/esm';

import { IAuthor, NewAuthor } from './author.model';

export const sampleWithRequiredData: IAuthor = {
  id: 24433,
  name: 'meh hover',
};

export const sampleWithPartialData: IAuthor = {
  id: 483,
  name: 'marimba circumnavigate majestically',
  birthDate: dayjs('2025-01-24T08:48'),
};

export const sampleWithFullData: IAuthor = {
  id: 16232,
  name: 'probe meh',
  birthDate: dayjs('2025-01-24T14:06'),
};

export const sampleWithNewData: NewAuthor = {
  name: 'upbeat since bah',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
