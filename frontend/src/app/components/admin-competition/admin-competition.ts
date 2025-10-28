import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionService, Competition } from '../../services/competition';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-competition',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-competition.html',
  styleUrl: './admin-competition.scss'
})
export class AdminCompetitionComponent implements OnInit {
  competitionForm: FormGroup;
  isEditMode = false;
  competitionId: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private competitionService: CompetitionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.competitionForm = this.createForm();
  }

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.competitionId;

    if (this.isEditMode && this.competitionId) {
      this.loadCompetition(this.competitionId);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      registrationFee: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private async loadCompetition(id: string): Promise<void> {
    try {
      this.isLoading = true;
      const competitions = await this.competitionService.getCompetitions();
      const competition = competitions.find(c => c.id === id);
      
      if (competition) {
        this.competitionForm.patchValue({
          name: competition.name,
          date: new Date(competition.date),
          location: competition.location,
          description: competition.description,
          registrationFee: competition.registrationFee
        });
      } else {
        this.showMessage('Competition not found');
        this.router.navigate(['/admin/competitions']);
      }
    } catch (error) {
      console.error('Error loading competition:', error);
      this.showMessage('Error loading competition');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.competitionForm.valid) {
      try {
        this.isLoading = true;
        const formValue = this.competitionForm.value;
        
        // Format date as YYYY-MM-DD string
        const formattedDate = formValue.date instanceof Date 
          ? formValue.date.toISOString().split('T')[0]
          : formValue.date;

        const competitionData: Omit<Competition, 'id'> = {
          name: formValue.name,
          date: formattedDate,
          location: formValue.location,
          description: formValue.description,
          registrationFee: parseFloat(formValue.registrationFee)
        };

        if (this.isEditMode && this.competitionId) {
          await this.competitionService.updateCompetition(this.competitionId, competitionData);
          this.showMessage('Competition updated successfully!');
        } else {
          await this.competitionService.addCompetition(competitionData);
          this.showMessage('Competition created successfully!');
        }

        this.router.navigate(['/admin/competitions']);
      } catch (error) {
        console.error('Error saving competition:', error);
        this.showMessage('Error saving competition. Please try again.');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.competitionForm.controls).forEach(field => {
      const control = this.competitionForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/competitions']);
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
  }

  getErrorMessage(fieldName: string): string {
    const control = this.competitionForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters`;
    }
    if (control?.hasError('min')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be 0 or greater`;
    }
    return '';
  }
}