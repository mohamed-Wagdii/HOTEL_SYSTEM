import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user';
import { UserModal } from '../../components/user-modal/user-modal';
import { Pagination } from '../../components/pagination/pagination';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, UserModal, Pagination],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  hostHotels: any[] = [];
  hostExperiences: any[] = [];
  
  loading = false;
  searchTerm = '';
  filterStatus = '';
  filterRole = '';
  roles: string[] = ['host', 'guest', 'admin'];

  currentPage: number = 1;
  itemsPerPage: number = 10;

  // Stats
  stats = {
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    hosts: 0,
    guests: 0
  };

  constructor(
    private userService: UserService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.filteredUsers = res;
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.toast.error('Failed to load users. Please try again.');
        this.loading = false;
      }
    });
  }

  calculateStats() {
    this.stats.total = this.users.length;
    this.stats.verified = this.users.filter(u => u.isVerified === 'verified').length;
    this.stats.pending = this.users.filter(u => u.isVerified === 'pending').length;
    this.stats.rejected = this.users.filter(u => u.isVerified === 'rejected').length;
    this.stats.hosts = this.users.filter(u => u.role.includes('host')).length;
    this.stats.guests = this.users.filter(u => u.role.includes('guest')).length;
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = !this.filterStatus || user.isVerified === this.filterStatus;
      const matchesRole = !this.filterRole || user.role.includes(this.filterRole);
      return matchesSearch && matchesStatus && matchesRole;
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  onStatusChange() {
    this.applyFilters();
  }

  onRoleChange() {
    this.applyFilters();
  }

  get pagedFilteredUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return (this.filteredUsers || []).slice(start, start + this.itemsPerPage);
  }

  onPage(page: number) {
    this.currentPage = page;
  }

  onItemsPerPageChange(items: number) {
    this.itemsPerPage = items;
    this.currentPage = 1;
  }

  openUserModal(user: User) {
    this.selectedUser = user;
    this.hostHotels = [];
    this.hostExperiences = [];

    if (user.role.includes('host')) {
      this.userService.getHotelsByHost(user._id).subscribe({
        next: (res) => { this.hostHotels = res; },
        error: (err) => {
          console.error('Error loading hotels:', err);
          this.toast.warning('Could not load hotels for this host');
        }
      });

      this.userService.getExperiencesByHost(user._id).subscribe({
        next: (res) => { this.hostExperiences = res; },
        error: (err) => {
          console.error('Error loading experiences:', err);
          this.toast.warning('Could not load experiences for this host');
        }
      });
    }
  }

  closeUserModal() {
    this.selectedUser = null;
    this.hostHotels = [];
    this.hostExperiences = [];
  }

  onVerifyUser(event: {user: User, reason: string}) {
    this.userService.verifyUser(event.user._id, 'verified', event.reason).subscribe({
      next: () => {
        this.toast.success(`${event.user.name} has been verified successfully!`);
        this.loadUsers();
        this.closeUserModal();
      },
      error: (err) => {
        console.error('Error verifying user:', err);
        this.toast.error('Failed to verify user. Please try again.');
      }
    });
  }

  onRejectUser(event: {user: User, reason: string}) {
    this.userService.verifyUser(event.user._id, 'rejected', event.reason).subscribe({
      next: () => {
        this.toast.success(`${event.user.name} has been rejected.`);
        this.loadUsers();
        this.closeUserModal();
      },
      error: (err) => {
        console.error('Error rejecting user:', err);
        this.toast.error('Failed to reject user. Please try again.');
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'verified': 'bg-success',
      'pending': 'bg-warning',
      'rejected': 'bg-danger',
      'notVerified': 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
  }

  trackById(index: number, user: User): string {
    return user._id;
  }
}