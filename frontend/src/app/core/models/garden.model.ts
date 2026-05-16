import { Flower } from './flower.model';

export interface Garden {
  id?: string;
  nome: string;
  theme: null;
  flowers: Flower[];
  createdAt?: string;
}
