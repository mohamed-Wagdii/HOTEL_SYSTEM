import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-reservation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservation-modal.html',
  styleUrls: ['./reservation-modal.css']
})
export class ReservationModal {
  @Input() reservation: Reservation | null = null;
  @Output() closeModal = new EventEmitter<void>();
}
