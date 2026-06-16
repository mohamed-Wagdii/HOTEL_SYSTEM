import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Experience } from '../models/experience';
import { Place } from '../models/place';
import { User } from '../models/user';
import { Reservation } from '../models/reservation';
import { map, Observable, forkJoin } from 'rxjs';
import { Hotel } from '../models/hotel';

interface ReservationStats {
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
}

interface MonthlyUserStats {
  month: string;
  count: number;
}

interface TopHotel {
  id: string;
  name: string;
  rating: number;
  reservationsCount: number;
  totalRevenue: number;
}

interface AnalyticsData {
  reservationStats: ReservationStats;
  monthlyUsers: MonthlyUserStats[];
  topHotels: TopHotel[];
  topExperiences: any[];
  totalRevenue: number;
  averageRating: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpService) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('user');
  }

  getAllPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>('places');
  }

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>('hotel');
  }

  getAllExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>('experiance');
  }

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

  // 📊 Analytics Methods

  getAnalyticsData(): Observable<AnalyticsData> {
    return forkJoin({
      users: this.getAllUsers(),
      hotels: this.getAllHotels(),
      experiences: this.getAllExperiences(),
      reservations: this.getAllReservations(),
    }).pipe(
      map(({ users, hotels, experiences, reservations }) => {
        return {
          reservationStats: this.calculateReservationStats(reservations),
          monthlyUsers: this.calculateMonthlyUsers(users),
          topHotels: this.calculateTopHotels(hotels, reservations),
          topExperiences: this.calculateTopExperiences(experiences, reservations),
          totalRevenue: this.calculateTotalRevenue(reservations),
          averageRating: this.calculateAverageRating(hotels, experiences),
        };
      })
    );
  }

  private calculateReservationStats(reservations: Reservation[]): ReservationStats {
    return {
      pending: reservations.filter((r) => r.status === 'pending').length,
      confirmed: reservations.filter((r) => r.status === 'confirmed').length,
      cancelled: reservations.filter((r) => r.status === 'cancelled').length,
      completed: reservations.filter((r) => r.status === 'completed').length,
    };
  }

  private calculateMonthlyUsers(users: User[]): MonthlyUserStats[] {
    const monthCounts: { [key: string]: number } = {};
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    users.forEach((user) => {
      if (user.createdAt) {
        const date = new Date(user.createdAt);
        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      }
    });

    return Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count }))
      .slice(-12); // آخر 12 شهر
  }

  private calculateTopHotels(hotels: Hotel[], reservations: Reservation[]): TopHotel[] {
    const hotelStats = hotels.map((hotel) => {
      const hotelReservations = reservations.filter(
        (r) => r.hotelName === hotel.name
      );
      const totalRevenue = hotelReservations.reduce(
        (sum, r) => sum + (r.totalPrice || 0),
        0
      );

      return {
        id: hotel.id,
        name: hotel.name,
        rating: hotel.starRating || 0,
        reservationsCount: hotelReservations.length,
        totalRevenue,
      };
    });

    return hotelStats
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10); // أعلى 10 فنادق
  }

  private calculateTopExperiences(experiences: Experience[], reservations: Reservation[]): any[] {
    return experiences
      .map((exp) => ({
        name: exp.name,
        rating: exp.starRating || 0,
        bookings: reservations.filter((r) => r.experienceName === exp.name).length,
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }

  private calculateTotalRevenue(reservations: Reservation[]): number {
    return reservations
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.totalPrice || 0), 0);
  }

  private calculateAverageRating(hotels: Hotel[], experiences: Experience[]): number {
    const allRatings = [
      ...hotels.map((h) => h.starRating || 0),
      ...experiences.map((e) => e.starRating || 0),
    ].filter((r) => r > 0);

    return allRatings.length > 0
      ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
      : 0;
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