import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Place } from '../../models/place';

@Component({
  selector: 'app-place-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-modal.html',
  styleUrl: './place-modal.css',
})
export class PlaceModal implements OnChanges {
  @Input() editMode = false;
  @Input() viewMode = false; // 👁️ إضافة وضع العرض فقط
  @Input() place: Place | null = null;

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  formData: any = {
    name: '',
    description: '',
    images: [],
    address: { country: '', city: '' },
  };

  selectedFiles: File[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['place'] && this.place) {
      this.formData = {
        ...this.place,
        address: this.place.address || { country: '', city: '' },
      };
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.selectedFiles = Array.from(input.files);
  }

  save() {
    if (this.viewMode) return; // ❌ لا يتم الحفظ في وضع العرض فقط

    // If there are files selected, send multipart/form-data. Otherwise send a plain object (JSON).
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      const form = new FormData();
      form.append('name', this.formData.name);
      form.append('description', this.formData.description);
      form.append('address[country]', this.formData.address.country);
      form.append('address[city]', this.formData.address.city);
      this.selectedFiles.forEach((file) => form.append('images', file));
      this.onSave.emit(form);
    } else {
      const payload = {
        name: this.formData.name,
        description: this.formData.description,
        address: {
          country: this.formData.address.country,
          city: this.formData.address.city,
        },
      };
      this.onSave.emit(payload);
    }
  }
}
