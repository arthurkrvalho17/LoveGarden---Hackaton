import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Garden } from '../models/garden.model';

@Injectable({ providedIn: 'root' })
export class GardenService {
  private readonly api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Garden[]> {
    return this.http.get<Garden[]>(`${this.api}/garden`);
  }

  findById(id: string): Observable<Garden> {
    return this.http.get<Garden>(`${this.api}/garden/${id}`);
  }

  create(garden: Omit<Garden, 'id' | 'createdAt'>): Observable<Garden> {
    return this.http.post<Garden>(`${this.api}/garden`, garden);
  }

  update(id: string, garden: Omit<Garden, 'id' | 'createdAt'>): Observable<Garden> {
    return this.http.put<Garden>(`${this.api}/garden/${id}`, garden);
  }
}
