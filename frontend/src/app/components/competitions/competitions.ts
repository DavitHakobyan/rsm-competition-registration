import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompetitionService, Competition } from '../../services/competition';
import { AuthService } from '../../services/auth';
import { ToolbarComponent } from '../toolbar/toolbar';

@Component({
  selector: 'app-competitions',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    ToolbarComponent
  ],
  templateUrl: './competitions.html',
  styleUrl: './competitions.scss'
})
export class CompetitionsComponent implements OnInit {
  competitions: Competition[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private competitionService: CompetitionService,
    private router: Router,
    private authService: AuthService
  ) {}

  // Open profile in view mode (adds query param ?mode=view)
  openProfile(): void {
    this.router.navigate(['/profile'], { queryParams: { mode: 'view' } });
  }

  async ngOnInit(): Promise<void> {
    await this.loadCompetitions();
  }

  async loadCompetitions(): Promise<void> {
    try {
      this.loading = true;
      this.competitions = await this.competitionService.getCompetitions();
    } catch (error) {
      console.error('Error loading competitions:', error);
      this.error = 'Failed to load competitions. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  onRegister(competition: Competition): void {
    if (competition.id) {
      this.router.navigate(['/register', competition.id]);
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }
}
