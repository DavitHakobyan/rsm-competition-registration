import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { CompetitionsComponent } from './components/competitions/competitions';
import { RegisterComponent } from './components/register/register';
import { MyRegistrationsComponent } from './components/my-registrations/my-registrations';
import { PaymentComponent } from './components/payment/payment';
import { AdminCompetitionsComponent } from './components/admin-competitions/admin-competitions';
import { AdminCompetitionComponent } from './components/admin-competition/admin-competition';
import { authGuard } from './guards/auth-guard';
import { AdminParentsComponent } from './components/admin-parents/admin-parents';
import { ParentProfileComponent } from './components/parent-profile/parent-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/competitions', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'profile', component: ParentProfileComponent, canActivate: [authGuard] },
  { path: 'competitions', component: CompetitionsComponent, canActivate: [authGuard] },
  { path: 'register/:competitionId', component: RegisterComponent, canActivate: [authGuard] },
  { path: 'payment/:registrationId', component: PaymentComponent, canActivate: [authGuard] },
  { path: 'my-registrations', component: MyRegistrationsComponent, canActivate: [authGuard] },
  { path: 'admin/competitions', component: AdminCompetitionsComponent, canActivate: [authGuard] },
  { path: 'admin/parents', component: AdminParentsComponent, canActivate: [authGuard] },
  { path: 'admin/competition/new', component: AdminCompetitionComponent, canActivate: [authGuard] },
  { path: 'admin/competition/edit/:id', component: AdminCompetitionComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/competitions' }
];
