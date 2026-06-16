import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpService) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>('user');
  }

  verifyUser(userId: string, status: 'verified' | 'rejected', reason: string): Observable<any> {
    return this.http.patch<any>(`user/verify/${userId}`, { status, reason });
  }

  getHotelsByHost(hostId: string) {
    return this.http.get<any[]>(`hotel/by-host/${hostId}`);
  }

  getExperiencesByHost(hostId: string) {
    return this.http.get<any[]>(`experiance/by-host/${hostId}`);
  }

  
}