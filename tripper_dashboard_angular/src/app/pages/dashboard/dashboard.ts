import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from './../../services/dashboard';
import { Card } from '../../components/card/card';
import { Hotel } from '../../models/hotel';
import { User } from '../../models/user';
import { Experience } from '../../models/experience';
import { Reservation } from '../../models/reservation';
import { Place } from '../../models/place';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  hotels: Hotel[] = [];
  users: User[] = [];
  experience: Experience[] = [];
  reservation: Reservation[] = [];
  place: Place[] = [];
  stats: any[] = [];

  analyticsData: any = null;
  isLoading = true;
  
  reservationChartData: any[] = [];
  monthlyUsersChartData: any[] = [];
  topHotelsData: any[] = [];

  totalRevenue = 0;
  averageRating = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    this.dashboardService.getAnalyticsData().subscribe({
      next: (data) => {
        this.analyticsData = data;
        this.prepareChartData(data);
        this.totalRevenue = data.totalRevenue;
        this.averageRating = data.averageRating;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading analytics:', err);
        this.isLoading = false;
      },
    });

    this.loadBasicData();
  }

  loadBasicData() {
    this.dashboardService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.updateStats();
      },
      error: (err) => console.error('Error loading hotels:', err),
    });

    this.dashboardService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.updateStats();
      },
      error: (err) => console.error('Error loading users:', err),
    });

    this.dashboardService.getAllExperiences().subscribe({
      next: (data) => {
        this.experience = data;
        this.updateStats();
      },
      error: (err) => console.error('Error loading experiences:', err),
    });

    this.dashboardService.getAllReservations().subscribe({
      next: (data) => {
        this.reservation = data;
        this.updateStats();
      },
      error: (err) => console.error('Error fetching reservations:', err),
    });

    this.dashboardService.getAllPlaces().subscribe({
      next: (res: any) => {
        this.place = res.data;
        this.updateStats();
      },
      error: (err) => console.error('Error loading places:', err),
    });
  }

  prepareChartData(data: any) {
    this.reservationChartData = [
      { name: 'Pending', value: data.reservationStats.pending, color: '#fbbf24' },
      { name: 'Confirmed', value: data.reservationStats.confirmed, color: '#10b981' },
      { name: 'Cancelled', value: data.reservationStats.cancelled, color: '#ef4444' },
      { name: 'Completed', value: data.reservationStats.completed, color: '#3b82f6' },
    ];

    this.monthlyUsersChartData = data.monthlyUsers;

    this.topHotelsData = data.topHotels;
  }

  updateStats() {
    this.stats = [
      {
        title: 'Hotels',
        count: this.hotels.length,
        icon: 'bi bi-building',
        color: 'primary',
      },
      {
        title: 'Users',
        count: this.users.length,
        icon: 'bi bi-people',
        color: 'success',
      },
      {
        title: 'Experiences',
        count: this.experience.length,
        icon: 'bi bi-stars',
        color: 'warning',
      },
      {
        title: 'Reservations',
        count: this.reservation.length,
        icon: 'bi bi-calendar-check',
        color: 'danger',
      },
      {
        title: 'Places',
        count: this.place.length,
        icon: 'bi bi-geo-alt',
        color: 'info',
      },
    ];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  }

  formatRating(rating: number): string {
    return rating.toFixed(1);
  }

  calculateStrokeDasharray(value: number, index: number): string {
    const total = this.reservationChartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return '0 100';
    
    const percentage = (value / total) * 100;
    const circumference = 2 * Math.PI * 25; 
    const segmentLength = (percentage / 100) * circumference;
    
    return `${segmentLength} ${circumference}`;
  }

  calculateStrokeDashoffset(index: number): number {
    const total = this.reservationChartData.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return 0;
    
    const circumference = 2 * Math.PI * 25;
    let offset = 0;
    
    for (let i = 0; i < index; i++) {
      const percentage = (this.reservationChartData[i].value / total) * 100;
      offset += (percentage / 100) * circumference;
    }
    
    return -offset;
  } 
}