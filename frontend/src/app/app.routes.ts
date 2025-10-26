import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CompetitionsComponent } from './components/competitions/competitions';
import { RegisterComponent } from './components/register/register';
import { MyRegistrationsComponent } from './components/my-registrations/my-registrations';
import { PaymentComponent } from './components/payment/payment';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/competitions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'competitions', component: CompetitionsComponent, canActivate: [authGuard] },
  { path: 'register/:competitionId', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'payment/:registrationId', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'my-registrations', component: MyRegistrationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/competitions' }
];
