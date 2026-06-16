import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pagination-container">
      <div class="pagination-info">
        <span class="text-muted">
          عرض {{ startItem }} - {{ endItem }} من {{ totalItems }} نتيجة
        </span>
      </div>

      <nav aria-label="Pagination">
        <ul class="pagination pagination-modern">
          <!-- Previous Button -->
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button 
              class="page-link" 
              (click)="onPageChange(currentPage - 1)"
              [disabled]="currentPage === 1"
              aria-label="Previous">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>

          <!-- First Page -->
          <li class="page-item" [class.active]="currentPage === 1" *ngIf="totalPages > 1">
            <button class="page-link" (click)="onPageChange(1)">1</button>
          </li>

          <!-- Dots before -->
          <li class="page-item disabled" *ngIf="currentPage > 3">
            <span class="page-link">...</span>
          </li>

          <!-- Middle Pages -->
          <li 
            class="page-item" 
            [class.active]="page === currentPage"
            *ngFor="let page of getVisiblePages()">
            <button class="page-link" (click)="onPageChange(page)">
              {{ page }}
            </button>
          </li>

          <!-- Dots after -->
          <li class="page-item disabled" *ngIf="currentPage < totalPages - 2">
            <span class="page-link">...</span>
          </li>

          <!-- Last Page -->
          <li 
            class="page-item" 
            [class.active]="currentPage === totalPages"
            *ngIf="totalPages > 1 && currentPage !== totalPages">
            <button class="page-link" (click)="onPageChange(totalPages)">
              {{ totalPages }}
            </button>
          </li>

          <!-- Next Button -->
          <li class="page-item" [class.disabled]="currentPage === totalPages">
            <button 
              class="page-link" 
              (click)="onPageChange(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              aria-label="Next">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
        </ul>
      </nav>

      <!-- Items per page selector -->
      <div class="items-per-page">
        <select 
          class="form-select form-select-sm"
          [ngModel]="itemsPerPage"
          (ngModelChange)="onItemsPerPageChange($event)">
          <option [value]="5">5 لكل صفحة</option>
          <option [value]="10">10 لكل صفحة</option>
          <option [value]="20">20 لكل صفحة</option>
          <option [value]="50">50 لكل صفحة</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 0;
      flex-wrap: wrap;
      gap: 1rem;
      margin-top: 2rem;
      border-top: 2px solid #f0f0f0;
    }

    .pagination-info {
      font-size: 0.9rem;
      color: #6c757d;
      font-weight: 500;
    }

    .pagination-modern {
      margin: 0;
      display: flex;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
    }

    .pagination-modern .page-item {
      margin: 0;
    }

    .pagination-modern .page-link {
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 0.5rem 0.85rem;
      color: #495057;
      font-weight: 600;
      background: white;
      transition: all 0.3s ease;
      cursor: pointer;
      min-width: 40px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pagination-modern .page-link:hover:not(:disabled) {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .pagination-modern .page-item.active .page-link {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .pagination-modern .page-item.disabled .page-link {
      color: #cbd5e0;
      cursor: not-allowed;
      background: #f8f9fa;
      border-color: #e9ecef;
    }

    .pagination-modern .page-link:disabled {
      color: #cbd5e0;
      cursor: not-allowed;
      background: #f8f9fa;
      border-color: #e9ecef;
    }

    .pagination-modern .page-link i {
      font-size: 0.85rem;
      font-weight: bold;
    }

    .items-per-page {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .items-per-page .form-select {
      border: 2px solid #e9ecef;
      border-radius: 0.5rem;
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      font-weight: 600;
      color: #495057;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: white;
      min-width: 130px;
    }

    .items-per-page .form-select:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
      outline: none;
    }

    .items-per-page .form-select:hover {
      border-color: #667eea;
    }

    @media (max-width: 768px) {
      .pagination-container {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .pagination-modern {
        gap: 0.3rem;
      }

      .pagination-modern .page-link {
        padding: 0.4rem 0.6rem;
        min-width: 35px;
        font-size: 0.875rem;
      }

      .items-per-page {
        width: 100%;
        justify-content: center;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .pagination-container {
      animation: fadeIn 0.4s ease;
    }
  `]
})
export class Pagination {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get startItem(): number {
    return this.totalItems === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    const end = this.currentPage * this.itemsPerPage;
    return end > this.totalItems ? this.totalItems : end;
  }

  getVisiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== this.totalPages) {
        pages.push(i);
      }
    }

    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onItemsPerPageChange(items: number): void {
    this.itemsPerPageChange.emit(items);
    this.pageChange.emit(1); // Reset to first page
  }
}