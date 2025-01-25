import dayjs from 'dayjs/esm';

export interface IAuthor {
  id: number;
  name?: string | null;
  birthDate?: dayjs.Dayjs | null;
}

export type NewAuthor = Omit<IAuthor, 'id'> & { id: null };
