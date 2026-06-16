import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceModal } from '../../components/place-modal/place-modal';
import { Pagination } from '../../components/pagination/pagination';
import { Place } from '../../models/place';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [CommonModule, PlaceModal, FormsModule, Pagination],
  templateUrl: './places.html',
  styleUrl: './places.css',
})
export class Places implements OnInit {
  places: Place[] = [];
  filteredPlaces: Place[] = [];
  selectedPlace: Place | null = null;
  
  loading = false;
  showModal = false;
  editMode = false;
  searchTerm = '';
  filterCity = '';
  cities: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Stats
  stats = {
    total: 0,
    countries: 0,
    cities: 0,
    averageRating: 0
  };

  constructor(private placesService: PlacesService) {}

  ngOnInit(): void {
    this.loadPlaces();
  }

  loadPlaces() {
    this.loading = true;
    this.placesService.getAllPlaces().subscribe({
      next: (res: any) => {
        this.places = Array.isArray(res) ? res : res?.data ?? [];
        this.filteredPlaces = this.places;
this.cities = [...new Set(
  this.places
    .map(p => p.address?.city)
    .filter((city): city is string => Boolean(city))
)];        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading places:', err);
        this.loading = false;
      },
    });
  }

  calculateStats() {
    this.stats.total = this.places.length;
    this.stats.countries = new Set(this.places.map(p => p.address?.country).filter(Boolean)).size;
    this.stats.cities = new Set(this.places.map(p => p.address?.city).filter(Boolean)).size;
    
    const ratings = this.places.map(p => p.starRating || 0).filter(r => r > 0);
    this.stats.averageRating = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
      : 0;
  }

  get pagedFilteredPlaces(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredPlaces || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  applyFilters() {
    this.filteredPlaces = this.places.filter(place => {
      const matchesSearch = place.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCity = !this.filterCity || place.address?.city === this.filterCity;
      return matchesSearch && matchesCity;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCityChange() {
    this.applyFilters();
  }

  openAddModal() {
    this.editMode = false;
    this.selectedPlace = null;
    this.showModal = true;
  }

  openEditModal(place: Place) {
    this.editMode = true;
    this.selectedPlace = { ...place };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedPlace = null;
  }

  savePlace(payload: any) {
    const doUpdate = (id: string, body: any) =>
      this.placesService.updatePlace(id, body).subscribe({
        next: (res) => {
          const updatedPlace = res?.data ?? res;
          if (updatedPlace && updatedPlace._id) {
            const index = this.places.findIndex((p) => p._id === updatedPlace._id);
            if (index !== -1) {
              this.places[index] = updatedPlace;
            } else {
              this.loadPlaces();
            }
          } else {
            this.loadPlaces();
          }
          this.closeModal();
        },
        error: (err) => console.error('Error updating place:', err),
      });

    const doCreate = (body: any) =>
      this.placesService.createPlace(body).subscribe({
        next: () => {
          this.loadPlaces();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error creating place:', err);
        },
      });

    if (this.editMode && this.selectedPlace?._id) {
      doUpdate(this.selectedPlace._id, payload);
    } else {
      doCreate(payload);
    }
  }

  deletePlace(place: Place) {
    if (!place._id) {
      console.error('Place id is missing!');
      return;
    }

    if (confirm(`Are you sure you want to delete "${place.name}"?`)) {
      this.placesService.deletePlace(place._id).subscribe({
        next: () => {
          this.loadPlaces();
        },
        error: (err) => console.error('Error deleting place:', err),
      });
    }
  }

trackById(index: number, place: Place): string {
  return place._id ?? index.toString();
}
}