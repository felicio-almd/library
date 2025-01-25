import dayjs from 'dayjs/esm';
import { IBook } from 'app/entities/book/book.model';
import { IUser } from 'app/entities/user/user.model';

export interface IBorrow {
  id: number;
  borrowDateTime?: dayjs.Dayjs | null;
  returnDateTime?: dayjs.Dayjs | null;
  book?: IBook | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewBorrow = Omit<IBorrow, 'id'> & { id: null };
