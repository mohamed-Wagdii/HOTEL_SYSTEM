import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  active = '/dashboard';
  links = [
    { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/users', label: 'Users', icon: 'bi-people' },
    { path: '/places', label: 'Places', icon: 'bi-geo-alt' },
    { path: '/hotels', label: 'Hotels', icon: 'bi-building' },
    { path: '/reservations', label: 'Reservations', icon: 'bi-calendar-check' },
    { path: '/experiences', label: 'Experiences', icon: 'bi-journal-code' },
  ];

  setActive(link: string) {
    this.active = link;
  }

  activeLink() {
    return this.active;
  }
}