import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Hotel } from '../../models/hotel';

@Component({
  selector: 'app-hotel-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-modal.html',
  styleUrls: ['./hotel-modal.css']
})
export class HotelModal {
  @Input() hotel: Hotel | null = null;
  @Output() closeModal = new EventEmitter<void>();
  selectedImage: string | null = null;

  openImage(imageUrl?: string) {
    if (imageUrl) {
      this.selectedImage = imageUrl;
    }
  }

  closeImageModal() {
    this.selectedImage = null;
  }
}
