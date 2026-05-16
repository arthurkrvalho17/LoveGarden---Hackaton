export interface FlowerMemory {
  title: string;
  message: string;
  imageUrl: string | null;
  audioUrl: string | null;
}

export interface FlowerPosition {
  x: number;
  y: number;
}

export interface Flower {
  id: string;
  type: string;
  position: FlowerPosition;
  memory: FlowerMemory;
}