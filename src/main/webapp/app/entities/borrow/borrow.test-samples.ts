import dayjs from 'dayjs/esm';

import { IBorrow, NewBorrow } from './borrow.model';

export const sampleWithRequiredData: IBorrow = {
  id: 7652,
  borrowDateTime: dayjs('2025-01-23T23:08'),
};

export const sampleWithPartialData: IBorrow = {
  id: 6459,
  borrowDateTime: dayjs('2025-01-23T20:58'),
};

export const sampleWithFullData: IBorrow = {
  id: 16522,
  borrowDateTime: dayjs('2025-01-23T18:20'),
  returnDateTime: dayjs('2025-01-23T20:53'),
};

export const sampleWithNewData: NewBorrow = {
  borrowDateTime: dayjs('2025-01-23T21:57'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
