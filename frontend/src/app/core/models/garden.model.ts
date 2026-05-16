import { Flower } from './flower.model';

export interface GardenTheme {
  sky: string | null;
  music: string | null;
  weatherEffect: string | null;
}

export interface Garden {
  id?: string;
  nome: string;
  theme: GardenTheme | null;
  flowers: Flower[];
  createdAt?: string;
}
