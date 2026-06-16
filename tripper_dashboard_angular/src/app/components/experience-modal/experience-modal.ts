import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Experience } from '../../models/experience';

@Component({
  selector: 'app-experience-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-modal.html',
  styleUrls: ['./experience-modal.css']
})
export class ExperienceModal {
  @Input() experience: Experience | null = null;
  @Output() closeModal = new EventEmitter<void>();
  selectedImage: string | null = null;

  get activityTitles(): string {
    return this.experience?.activities?.map((a: any) => a.title)?.join(', ') || '';
  }

  openImage(imageUrl?: string) {
    if (imageUrl) this.selectedImage = imageUrl;
  }

  closeImageModal() {
    this.selectedImage = null;
  }
}
