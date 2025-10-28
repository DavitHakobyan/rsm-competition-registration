import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { User } from '@angular/fire/auth';
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, MatDivider],
  templateUrl: './toolbar.html',
  styleUrls: ['./toolbar.scss']
})
export class ToolbarComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  openProfileView(): void {
    this.router.navigate(['/profile'], { queryParams: { mode: 'view' } });
  }

  // Simple refresh action: reload the page to refresh data across components
  refresh(): void {
    // Use a full page reload to ensure all components re-fetch data
    window.location.reload();
  }
}
