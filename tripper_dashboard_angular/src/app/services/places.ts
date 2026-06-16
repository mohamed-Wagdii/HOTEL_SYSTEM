import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Place } from '../models/place';

export interface PlaceStats {
  total: number;
  countries: number;
  cities: number;
  averageRating: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private http: HttpService) {}

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>('places');
  }

  getPlaceById(id: string): Observable<Place> {
    return this.http.get<Place>(`places/${id}`);
  }

  createPlace(formData: FormData): Observable<any> {
    return this.http.post<any>('places', formData);
  }

  updatePlace(id: string, formData: FormData | any): Observable<any> {
    return this.http.put<any>(`places/${id}`, formData);
  }

  deletePlace(id: string): Observable<any> {
    return this.http.delete<any>(`places/${id}`);
  }

  getPlaceStats(): Observable<PlaceStats> {
    return this.http.get<PlaceStats>('places/admin/stats');
  }
}