// reservation.service.ts
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Reservation } from '../models/reservation';

export interface ReservationStats {
  totalReservations: number;
  statusCounts: { _id: string; count: number }[];
  totalRevenue: string;
  averagePrice: string;
}

@Injectable({ providedIn: 'root' })
export class ReservationService {
  constructor(private http: HttpService) {}

  getAllReservations(): Observable<Reservation[]> {
    return this.http.get<any[]>('api/reservations').pipe(
      map((data) =>
        data.map((r) => ({
          id: r._id,
          guestName: r.guestId?.name || 'Unknown',
          guestEmail: r.guestId?.email || '',
          hotelName: r.hotelId?.name || undefined,
          experienceName: r.experienceId?.name || undefined,
          checkIn: this.formatDate(r.checkIn),
          checkOut: r.checkOut ? this.formatDate(r.checkOut) : '-',
          totalPrice: r.totalPrice,
          guestsCount: r.guestsCount,
          status: r.status,
        }))
      )
    );
  }

  getReservationStats(): Observable<ReservationStats> {
    return this.http.get<ReservationStats>('api/reservations/admin/stats');
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}