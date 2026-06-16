import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { Pagination } from '../pagination/pagination';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './user-table.html',
  styleUrls: ['./user-table.css']
})
export class UserTable {
  @Input() users: User[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  @Output() viewUser = new EventEmitter<User>();
  @Output() verifyUser = new EventEmitter<User>();
  @Output() rejectUser = new EventEmitter<User>();

  onView(user: User) {
    this.viewUser.emit(user);
  }

  get pagedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.users || []).slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }
}