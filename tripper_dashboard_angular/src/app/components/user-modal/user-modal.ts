import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.css']
})
export class UserModal {
  @Input() user: User | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() verifyUser = new EventEmitter<{user: User, reason: string}>();
  @Output() rejectUser = new EventEmitter<{user: User, reason: string}>();
  @Input() hotels: any[] = [];
  @Input() experiences: any[] = [];

  showReasonInput = false;
  actionType: 'verify' | 'reject' | null = null;
  reason = '';
  errorMessage = '';

  onVerifyClick() {
    this.actionType = 'verify';
    this.showReasonInput = true;
    this.reason = '';
    this.errorMessage = '';
  }

  onRejectClick() {
    this.actionType = 'reject';
    this.showReasonInput = true;
    this.reason = '';
    this.errorMessage = '';
  }

  confirmAction() {
    const trimmedReason = this.reason.trim();
    
    if (!trimmedReason) {
      this.errorMessage = 'Please enter a reason';
      return;
    }

    if (trimmedReason.length < 10) {
      this.errorMessage = 'Reason must be at least 10 characters';
      return;
    }

    this.errorMessage = '';

    if (this.actionType === 'verify' && this.user) {
      this.verifyUser.emit({ user: this.user, reason: trimmedReason });
    } else if (this.actionType === 'reject' && this.user) {
      this.rejectUser.emit({ user: this.user, reason: trimmedReason });
    }

    this.resetReasonInput();
  }

  cancelAction() {
    this.resetReasonInput();
  }

  resetReasonInput() {
    this.showReasonInput = false;
    this.actionType = null;
    this.reason = '';
    this.errorMessage = '';
  }
}