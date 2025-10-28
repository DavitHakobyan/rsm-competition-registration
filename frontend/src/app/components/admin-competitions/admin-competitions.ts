import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CompetitionService, Competition } from '../../services/competition';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-competitions',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './admin-competitions.html',
  styleUrl: './admin-competitions.scss'
})
export class AdminCompetitionsComponent implements OnInit {
  competitions: Competition[] = [];
  displayedColumns: string[] = ['name', 'date', 'location', 'fee', 'actions'];
  isLoading = false;

  constructor(
    private competitionService: CompetitionService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  async loadCompetitions(): Promise<void> {
    try {
      this.isLoading = true;
      this.competitions = await this.competitionService.getCompetitions();
    } catch (error) {
      console.error('Error loading competitions:', error);
      this.showMessage('Error loading competitions');
    } finally {
      this.isLoading = false;
    }
  }

  createCompetition(): void {
    this.router.navigate(['/admin/competition/new']);
  }

  editCompetition(competition: Competition): void {
    if (competition.id) {
      this.router.navigate(['/admin/competition/edit', competition.id]);
    }
  }

  async deleteCompetition(competition: Competition): Promise<void> {
    if (competition.id && confirm(`Are you sure you want to delete "${competition.name}"?`)) {
      try {
        this.isLoading = true;
        await this.competitionService.deleteCompetition(competition.id);
        this.showMessage('Competition deleted successfully');
        await this.loadCompetitions();
      } catch (error) {
        console.error('Error deleting competition:', error);
        this.showMessage('Error deleting competition');
      } finally {
        this.isLoading = false;
      }
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  goToCompetitions(): void {
    this.router.navigate(['/competitions']);
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}