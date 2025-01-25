export interface IBookCategory {
  id: number;
  name?: string | null;
  description?: string | null;
}

export type NewBookCategory = Omit<IBookCategory, 'id'> & { id: null };
