import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlantedFlower {
  id: number;
  type: 'rosa' | 'girassol' | 'tulipa';
  x: number;
  y: number;
  titulo: string;
  mensagem: string;
  imageURL: string | null;
}

export interface Garden {
  _id?: string;
  nome: string;
  flores: PlantedFlower[];
  criadoEm?: string;
}

const API = 'http://localhost:9999';

@Injectable({ providedIn: 'root' })
export class GardenService {

  constructor(private http: HttpClient) {}

  findAll(): Observable<Garden[]> {
    return this.http.get<Garden[]>(`${API}/gardens`);
  }

  findById(id: string): Observable<Garden> {
    return this.http.get<Garden>(`${API}/gardens/${id}`);
  }

  create(garden: Omit<Garden, '_id'>): Observable<Garden> {
    return this.http.post<Garden>(`${API}/gardens`, garden);
  }

  update(id: string, garden: Omit<Garden, '_id'>): Observable<Garden> {
    return this.http.put<Garden>(`${API}/gardens/${id}`, garden);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/gardens/${id}`);
  }
}