import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
      @for (toast of toasts; track toast) {
        <div 
          class="toast show align-items-center border-0"
          [ngClass]="{
            'text-bg-success': toast.type === 'success',
            'text-bg-danger': toast.type === 'error',
            'text-bg-info': toast.type === 'info',
            'text-bg-warning': toast.type === 'warning'
          }"
          role="alert"
          [@slideIn]
        >
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi" 
                [ngClass]="{
                  'bi-check-circle-fill': toast.type === 'success',
                  'bi-x-circle-fill': toast.type === 'error',
                  'bi-info-circle-fill': toast.type === 'info',
                  'bi-exclamation-triangle-fill': toast.type === 'warning'
                }">
              </i>
              {{ toast.message }}
            </div>
            <button 
              type="button" 
              class="btn-close btn-close-white me-2 m-auto" 
              (click)="remove(toast)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast {
      min-width: 300px;
      margin-bottom: 10px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .toast-body {
      padding: 12px 16px;
      font-size: 14px;
    }

    .toast-body i {
      margin-right: 8px;
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toast$.subscribe((toast) => {
      this.toasts.push(toast);
      
      setTimeout(() => {
        this.remove(toast);
      }, toast.duration || 3000);
    });
  }

  remove(toast: Toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}