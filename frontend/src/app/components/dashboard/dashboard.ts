import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth';
import { DataSeedService } from '../../services/data-seed';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private dataSeedService: DataSeedService
  ) {
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {}

  async signOut(): Promise<void> {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  async seedData(): Promise<void> {
    try {
      await this.dataSeedService.seedCompetitions();
      alert('Sample competitions added successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error adding sample competitions. Please try again.');
    }
  }

  /*
  async seedData(): Promise<void> {
    try {
      await this.dataSeedService.seedCompetitions();
      alert('Sample competitions added successfully!');
    } catch (error) {
      console.error('Error seeding data:', error);
      alert('Error adding sample competitions. Please try again.');
    }
  }*/
}
