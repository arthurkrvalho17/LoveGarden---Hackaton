import { Flower } from "./flower.model";

export interface Garden {

  id?: string;

  title: string;

  flowers: Flower[];  
}