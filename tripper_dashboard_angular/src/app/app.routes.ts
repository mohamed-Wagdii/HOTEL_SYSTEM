import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Users } from './pages/users/users';
import { Places } from './pages/places/places';
import { Hotels } from './pages/hotels/hotels';
import { Reservations } from './pages/reservations/reservations';
import { ExperienceComponent } from './pages/experiences/experiences';
import { LoginComponent } from './pages/login/login';
import { AuthGuard } from './guards/auth-guard';
import { LayoutComponent } from './pages/layout/layout';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'places', component: Places },
      { path: 'hotels', component: Hotels },
      { path: 'reservations', component: Reservations },
      { path: 'experiences', component: ExperienceComponent },
    ],
  },

  { path: '**', redirectTo: '' },
];