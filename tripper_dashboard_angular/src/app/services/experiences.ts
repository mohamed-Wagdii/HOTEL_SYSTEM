// experience.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Experience } from '../models/experience';

export interface ExperienceStats {
  totalExperiences: number;
  topCities: { _id: string; count: number }[];
  topCountries: { _id: string; count: number }[];
  averagePrice: string;
  averageRating: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  constructor(private http: HttpService) {}

  getAllExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>('experiance');
  }

  getExperienceById(id: string): Observable<Experience> {
    return this.http.get<Experience>(`experiance/${id}`);
  }

  deleteExperience(id: string): Observable<any> {
    return this.http.delete<any>(`experiance/admin/${id}`);
  }

  getExperienceStats(): Observable<ExperienceStats> {
    return this.http.get<ExperienceStats>('experiance/admin/stats');
  }
}