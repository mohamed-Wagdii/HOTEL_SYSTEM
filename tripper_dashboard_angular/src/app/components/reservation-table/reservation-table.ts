import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/reservation';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-reservation-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './reservation-table.html',
  styleUrls: ['./reservation-table.css']
})
export class ReservationTable {
  @Input() reservations: Reservation[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  @Output() viewReservation = new EventEmitter<Reservation>();

  onView(reservation: Reservation) {
    this.viewReservation.emit(reservation);
  }

  get pagedReservations(): Reservation[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.reservations || []).slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }
}