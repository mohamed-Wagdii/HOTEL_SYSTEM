import { Component, OnInit } from '@angular/core';
import { Experience } from '../../models/experience';
import { ExperienceService, ExperienceStats } from '../../services/experiences';
import { CommonModule } from '@angular/common';
import { ExperienceModal } from '../../components/experience-modal/experience-modal';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ExperienceModal, FormsModule, Pagination],
  templateUrl: './experiences.html',
  styleUrl: './experiences.css'
})
export class ExperienceComponent implements OnInit {
  experiences: Experience[] = [];
  filteredExperiences: Experience[] = [];
  selectedExperience: Experience | null = null;
  stats: ExperienceStats | null = null;
  loading = false;
  showStats = true;
  searchTerm = '';
  filterCity = '';
  cities: string[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private experienceService: ExperienceService) {}

  ngOnInit(): void {
    this.getExperiences();
    this.getStats();
  }

  getExperiences() {
    this.loading = true;
    this.experienceService.getAllExperiences().subscribe({
      next: (data) => {
        this.experiences = data;
        this.filteredExperiences = data;
        this.cities = [...new Set(data.map(exp => exp.address.city))];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading experiences:', err);
        this.loading = false;
      },
    });
  }

  getStats() {
    this.experienceService.getExperienceStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => console.error('Error loading stats:', err),
    });
  }

  applyFilters() {
    this.filteredExperiences = this.experiences.filter(exp => {
      const matchesSearch = exp.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCity = !this.filterCity || exp.address.city === this.filterCity;
      return matchesSearch && matchesCity;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCityChange() {
    this.applyFilters();
  }

  get pagedFilteredExperiences(): Experience[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredExperiences || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) { this.currentPage = page; }

  onItemsPerPageChange(items: number) { this.itemsPerPage = items; this.currentPage = 1; }

  toggleStats() {
    this.showStats = !this.showStats;
  }

  openExperienceDetails(exp: Experience) {
    this.selectedExperience = exp;
  }

  closeExperienceDetails() {
    this.selectedExperience = null;
  }

  deleteExperience(experience: any) {
    if (!experience?._id) {
      console.error('Experience id is missing!', experience);
      return;
    }

    if (confirm('Are you sure you want to delete this experience?')) {
      this.experienceService.deleteExperience(experience._id).subscribe({
        next: () => {
          console.log('Deleted successfully');
          this.getExperiences();
          this.getStats();
        },
        error: (err) => console.error('Error deleting experience: ', err)
      });
    }
  }

  // ✅ إضافة الـ trackBy function
  trackById(index: number, experience: Experience): string {
    return experience._id || experience.id;
  }
}