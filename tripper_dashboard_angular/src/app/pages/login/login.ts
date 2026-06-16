import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

  form!: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';

    const payload = {
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    };

    this.auth.signin(payload).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.user?.activeRole !== 'admin') {
          this.errorMsg = 'Unauthorized (Admins Only)';
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Invalid email or password';
      },
    });
  }
}