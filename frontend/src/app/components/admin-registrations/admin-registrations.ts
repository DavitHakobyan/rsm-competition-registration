import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RegistrationService, Registration } from '../../services/registration';
import { ToolbarComponent } from '../toolbar/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-admin-registrations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    ToolbarComponent
  ],
  templateUrl: './admin-registrations.html',
  styleUrls: ['./admin-registrations.scss']
})
export class AdminRegistrationsComponent implements OnInit {
  registrations: Registration[] = [];
  displayedColumns: string[] = ['parentName', 'parentContact', 'studentName', 'competitionName', 'registrationDate', 'paid', 'actions'];
  isLoading = false;

  dataSource = new MatTableDataSource<Registration>(this.registrations);

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private registrationService: RegistrationService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  ngAfterViewInit(): void {
    // Attach paginator/sort after view init
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async loadRegistrations(): Promise<void> {
    try {
      this.isLoading = true;
      this.registrations = await this.registrationService.getAllRegistrations();
      this.dataSource.data = this.registrations;
    } catch (error) {
      console.error('Error loading registrations', error);
      this.snackBar.open('Error loading registrations', 'Close', { duration: 3000 });
    } finally {
      this.isLoading = false;
    }
  }

  formatDate(d: any): string {
    if (!d) return '';
    const date = d instanceof Date ? d : new Date(d);
    return date.toLocaleString();
  }

  applyFilter(value: string): void {
    this.dataSource.filter = (value || '').trim().toLowerCase();
  }

  exportCsv(): void {
    const rows = this.dataSource.data.map(r => ({
      parentName: (r as any).parentName || r.parentId,
      parentEmail: (r as any).parentEmail || '',
      studentName: r.studentName,
      competitionName: r.competitionName || r.competitionId,
      registrationDate: this.formatDate(r.registrationDate),
      paid: r.paid
    }));
    const csv = [Object.keys(rows[0] || {}).join(','), ...rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  async togglePaid(reg: Registration): Promise<void> {
    if (!reg.id) return;
    try {
      // Use undefined when clearing the paymentDate so it matches the optional Date type
      await this.registrationService.updateRegistration(reg.id, { paid: !reg.paid, paymentDate: !reg.paid ? new Date() : undefined });
      this.snackBar.open(`Updated payment status for ${reg.studentName}`, 'Close', { duration: 2000 });
      await this.loadRegistrations();
    } catch (error) {
      console.error('Error updating payment status', error);
      this.snackBar.open('Error updating payment status', 'Close', { duration: 3000 });
    }
  }

  viewRegistration(reg: Registration): void {
    // Simple detail view — open an alert for now (could be a dialog)
    window.alert(JSON.stringify(reg, null, 2));
  }

  async deleteRegistration(reg: Registration): Promise<void> {
    if (!reg.id) return;
    if (!confirm(`Delete registration for ${reg.studentName}?`)) return;
    try {
      await this.registrationService.deleteRegistration(reg.id);
      this.snackBar.open('Registration deleted', 'Close', { duration: 2000 });
      await this.loadRegistrations();
    } catch (error) {
      console.error('Error deleting registration', error);
      this.snackBar.open('Error deleting registration', 'Close', { duration: 3000 });
    }
  }
}
