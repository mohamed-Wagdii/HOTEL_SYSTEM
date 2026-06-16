import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReservationService, ReservationStats } from '../../services/reservation.service';
import { Reservation } from '../../models/reservation';
import { ReservationTable } from '../../components/reservation-table/reservation-table';
import { ReservationModal } from '../../components/reservation-modal/reservation-modal';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ReservationModal, FormsModule, Pagination],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations implements OnInit {
  reservations: Reservation[] = [];
  filteredReservations: Reservation[] = [];
  selectedReservation: Reservation | null = null;
  stats: ReservationStats | null = null;
  loading = false;
  showStats = true;
  searchTerm = '';
  filterStatus = '';
  statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadStats();
  }

  loadReservations() {
    this.loading = true;
    this.reservationService.getAllReservations().subscribe({
      next: (data) => {
        this.reservations = data;
        this.filteredReservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching reservations:', err);
        this.loading = false;
      },
    });
  }

  loadStats() {
    this.reservationService.getReservationStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err),
    });
  }

  applyFilters() {
    this.filteredReservations = this.reservations.filter(reservation => {
      const matchesSearch = 
        reservation.guestName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.guestEmail.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.hotelName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        reservation.experienceName?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.filterStatus || reservation.status === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  get pagedFilteredReservations(): Reservation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredReservations || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) { this.currentPage = page; }

  onItemsPerPageChange(items: number) { this.itemsPerPage = items; this.currentPage = 1; }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  openReservationDetails(reservation: Reservation) {
    this.selectedReservation = reservation;
  }

  closeReservationDetails() {
    this.selectedReservation = null;
  }

  getStatusCount(status: string): number {
    if (!this.stats) return 0;
    const statusObj = this.stats.statusCounts.find(s => s._id === status);
    return statusObj ? statusObj.count : 0;
  }

  trackById(index: number, reservation: Reservation): string {
    return reservation.id;
  }
}