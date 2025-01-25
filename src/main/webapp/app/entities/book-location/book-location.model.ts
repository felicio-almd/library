export interface IBookLocation {
  id: number;
  aisle?: string | null;
  shelf?: string | null;
}

export type NewBookLocation = Omit<IBookLocation, 'id'> & { id: null };
