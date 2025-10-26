import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { RegistrationService, Registration } from '../../services/registration';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.scss'
})
export class MyRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadRegistrations();
  }

  async loadRegistrations(): Promise<void> {
    try {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      this.registrations = await this.registrationService.getRegistrationsByParent(currentUser.uid);
    } catch (error) {
      console.error('Error loading registrations:', error);
      this.error = 'Failed to load registrations. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed': return 'primary';
      case 'pending': return 'accent';
      case 'cancelled': return 'warn';
      default: return 'basic';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'confirmed': return 'check_circle';
      case 'pending': return 'schedule';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getPaymentStatusIcon(paid: boolean): string {
    return paid ? 'payment' : 'payment_outlined';
  }

  getPaymentStatusText(paid: boolean): string {
    return paid ? 'Paid' : 'Payment Pending';
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onViewDetails(registration: Registration): void {
    // TODO: Implement registration details view
    console.log('View details for registration:', registration);
  }

  async onCancelRegistration(registration: Registration): Promise<void> {
    if (registration.status === 'cancelled') {
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to cancel the registration for ${registration.studentName} in ${registration.competitionName}?`
    );

    if (confirmed && registration.id) {
      try {
        await this.registrationService.cancelRegistration(registration.id);
        this.snackBar.open('Registration cancelled successfully', 'Close', { duration: 3000 });
        await this.loadRegistrations(); // Reload to show updated status
      } catch (error) {
        console.error('Error cancelling registration:', error);
        this.snackBar.open('Error cancelling registration. Please try again.', 'Close', { duration: 3000 });
      }
    }
  }

  onPayNow(registration: Registration): void {
    if (registration.paid) {
      return;
    }
    
    // TODO: Integrate with payment system
    this.snackBar.open('Payment integration coming soon!', 'Close', { duration: 3000 });
  }

  onAddNewRegistration(): void {
    this.router.navigate(['/competitions']);
  }
}