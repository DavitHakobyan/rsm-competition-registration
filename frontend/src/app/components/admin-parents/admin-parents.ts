import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RegistrationService, Registration } from '../../services/registration';
import { AuthService } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-admin-parents',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './admin-parents.html',
  styleUrl: './admin-parents.scss'
})
export class AdminParentsComponent implements OnInit {
  registrations: Registration[] = [];
  displayedColumns: string[] = ['parentId', 'studentName', 'competitionName', 'registrationDate', 'paid', 'actions'];
  isLoading = false;

  constructor(
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  goToCompetitions(): void {
    this.router.navigate(['/competitions']);
  }

  async loadRegistrations(): Promise<void> {
    try {
      this.isLoading = true;
      this.registrations = await this.registrationService.getAllRegistrations();
    } catch (error) {
      console.error('Error loading registrations:', error);
      this.showMessage('Error loading registrations');
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(dateString: any): string {
    const d = dateString ? new Date(dateString) : null;
    return d ? d.toLocaleDateString('en-US') + ' ' + d.toLocaleTimeString('en-US') : '';
  }

  formatPrice(price?: number): string {
    if (price == null) return '';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  viewRegistration(reg: Registration): void {
    if (reg.id) {
      this.router.navigate(['/admin/competition/edit', reg.competitionId]);
    }
  }

  async togglePaid(reg: Registration): Promise<void> {
    if (!reg.id) return;
    try {
      this.isLoading = true;
      await this.registrationService.updateRegistration(reg.id, { paid: !reg.paid });
      await this.loadRegistrations();
      this.showMessage('Updated payment status');
    } catch (error) {
      console.error('Error updating payment status:', error);
      this.showMessage('Error updating payment status');
    } finally {
      this.isLoading = false;
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' });
  }
}
