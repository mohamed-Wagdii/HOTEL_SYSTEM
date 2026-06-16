import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../models/hotel';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-hotel-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './hotel-table.html',
  styleUrls: ['./hotel-table.css']
})
export class HotelTable {
  @Input() hotels: Hotel[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  @Output() viewHotel = new EventEmitter<Hotel>();
  @Output() deleteHotel = new EventEmitter<Hotel>();

  get pagedHotels(): Hotel[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.hotels || []).slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  onView(hotel: Hotel) {
    this.viewHotel.emit(hotel);
  }

  onDelete(hotel: Hotel) {
    if (confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
      this.deleteHotel.emit(hotel);
    }
  }
}