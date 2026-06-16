import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'place-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './place-table.html',
  styleUrls: ['./place-table.css'],
})
export class PlaceTable {
  @Input() places: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<string>();
  @Output() onView = new EventEmitter<string>();

  get pagedPlaces(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.places || []).slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  onViewPlace(placeId: string) {
    this.onView.emit(placeId);
  }
}