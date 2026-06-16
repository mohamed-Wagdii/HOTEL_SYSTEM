import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../models/experience';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-experience-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './experience-table.html',
  styleUrls: ['./experience-table.css']
})
export class ExperienceTable {
  @Input() experiences: Experience[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  @Output() viewExperience = new EventEmitter<Experience>();
  @Output() deleteExperience = new EventEmitter<Experience>();

  onView(experience: Experience) {
    this.viewExperience.emit(experience);
  }

onDelete(experience: Experience) {
  this.deleteExperience.emit(experience); 
}
trackById(index: number, experience: any) {
  return experience.id; // أو أي مفتاح فريد عندك
}

  get pagedExperiences(): Experience[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.experiences || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) {
    this.currentPage = page;
  }

  // HTML sometimes uses onPageChange; keep both names to be safe
  onPageChange(page: number) { this.onPage(page); }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

}
