import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Place } from '../../models/place';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './place-card.html',
  styleUrls: ['./place-card.css'],
})
export class PlaceCard {
  @Input() place: Place | null = null;
  @Output() onClose = new EventEmitter<void>();
  selectedImage: string | null = null;


  openImage(imageUrl?: string) {
  if (imageUrl) {
    this.selectedImage = imageUrl;
  }
}
closeImageModal() {
  this.selectedImage = null;
}

  closeCard() {
    this.onClose.emit();
  }
}
