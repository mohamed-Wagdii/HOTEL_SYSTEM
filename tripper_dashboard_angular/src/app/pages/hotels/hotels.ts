import { Component, OnInit } from '@angular/core';
import { Hotel } from '../../models/hotel';
import { CommonModule } from '@angular/common';
import { HotelTable } from '../../components/hotel-table/hotel-table';
import { HotelModal } from '../../components/hotel-modal/hotel-modal';
import { HotelService, HotelStats } from '../../services/hotel.service';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-hotels',
  standalone: true,
  imports: [CommonModule, HotelModal, FormsModule, Pagination],
  templateUrl: './hotels.html',
  styleUrl: './hotels.css',
})
export class Hotels implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  selectedHotel: Hotel | null = null;
  stats: HotelStats | null = null;
  loading = false;
  showStats = true;
  searchTerm = '';
  filterCity = '';
  cities: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private hotelService: HotelService) {}

  ngOnInit() {
    this.loadHotels();
    this.loadStats();
  }

  loadHotels() {
    this.loading = true;
    this.hotelService.getAllHotels().subscribe({
      next: (data) => {
        this.hotels = data;
        this.filteredHotels = data;
        this.cities = [...new Set(data.map(h => h.address.city))];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.loading = false;
      },
    });
  }

  loadStats() {
    this.hotelService.getHotelStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err),
    });
  }

  applyFilters() {
    this.filteredHotels = this.hotels.filter(hotel => {
      const matchesSearch = hotel.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCity = !this.filterCity || hotel.address.city === this.filterCity;
      return matchesSearch && matchesCity;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCityChange() {
    this.applyFilters();
  }

  get pagedFilteredHotels(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredHotels || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) { this.currentPage = page; }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  openHotelDetails(hotel: Hotel) {
    this.selectedHotel = hotel;
  }

  closeHotelDetails() {
    this.selectedHotel = null;
  }

  deleteHotel(hotel: Hotel) {
    if (!hotel.id) {
      console.error('Hotel id is missing!');
      return;
    }

    if (confirm(`Are you sure you want to delete "${hotel.name}"?`)) {
      this.hotelService.deleteHotel(hotel.id).subscribe({
        next: () => {
          console.log('Deleted successfully');
          this.loadHotels();
          this.loadStats();
        },
        error: (err) => console.error('Error deleting hotel:', err)
      });
    }
  }

  trackById(index: number, hotel: Hotel): string {
    return hotel.id;
  }
}