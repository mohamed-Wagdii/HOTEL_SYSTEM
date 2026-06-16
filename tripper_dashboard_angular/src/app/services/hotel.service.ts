import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Hotel } from '../models/hotel';

export interface HotelStats {
  totalHotels: number;
  topCities: { _id: string; count: number }[];
  topCountries: { _id: string; count: number }[];
  averagePrice: string;
  averageRating: string;
}

@Injectable({ providedIn: 'root' })
export class HotelService {
  constructor(private http: HttpService) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('hotel');
  }

  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`hotel/${id}`);
  }

  deleteHotel(id: string): Observable<any> {
    return this.http.delete<any>(`hotel/admin/${id}`);
  }

  getHotelStats(): Observable<HotelStats> {
    return this.http.get<HotelStats>('hotel/admin/stats');
  }
}