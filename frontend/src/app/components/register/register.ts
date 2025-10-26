import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RegistrationService, Registration } from '../../services/registration';
import { CompetitionService, Competition } from '../../services/competition';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  competition: Competition | null = null;
  loading = false;
  submitting = false;
  
  grades = [
    'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
    '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registrationService: RegistrationService,
    private competitionService: CompetitionService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.registrationForm = this.createForm();
  }

  async ngOnInit(): Promise<void> {
    const competitionId = this.route.snapshot.paramMap.get('competitionId');
    if (competitionId) {
      await this.loadCompetition(competitionId);
    } else {
      this.router.navigate(['/competitions']);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      studentGrade: ['', Validators.required],
      studentSchool: [''],
      studentAge: ['', [Validators.min(5), Validators.max(18)]],
      parentPhone: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      emergencyContact: [''],
      emergencyPhone: ['', [Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      specialNeeds: [''],
      dietaryRestrictions: ['']
    });
  }

  async loadCompetition(competitionId: string): Promise<void> {
    try {
      this.loading = true;
      const competitions = await this.competitionService.getCompetitions();
      this.competition = competitions.find(c => c.id === competitionId) || null;
      
      if (!this.competition) {
        this.snackBar.open('Competition not found', 'Close', { duration: 3000 });
        this.router.navigate(['/competitions']);
      }
    } catch (error) {
      console.error('Error loading competition:', error);
      this.snackBar.open('Error loading competition details', 'Close', { duration: 3000 });
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

  formatPhoneNumber(event: any, controlName: string): void {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length >= 6) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
      formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else {
      formattedValue = value;
    }

    this.registrationForm.get(controlName)?.setValue(formattedValue);
  }

  getErrorMessage(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required`;
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.getError('minlength').requiredLength} characters`;
    }
    if (control?.hasError('pattern')) {
      return 'Please enter a valid phone number (XXX) XXX-XXXX';
    }
    if (control?.hasError('min')) {
      return `Age must be at least ${control.getError('min').min}`;
    }
    if (control?.hasError('max')) {
      return `Age must be at most ${control.getError('max').max}`;
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (this.registrationForm.valid && this.competition) {
      try {
        this.submitting = true;
        
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          throw new Error('User not authenticated');
        }

        const registrationData = {
          parentId: currentUser.uid,
          competitionId: this.competition.id!,
          competitionName: this.competition.name,
          ...this.registrationForm.value
        };

        const registrationId = await this.registrationService.createRegistration(registrationData);
        
        this.snackBar.open('Registration submitted successfully!', 'Close', { 
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        
        // Navigate to registrations list or payment
        this.router.navigate(['/my-registrations']);
        
      } catch (error) {
        console.error('Error submitting registration:', error);
        this.snackBar.open('Error submitting registration. Please try again.', 'Close', { 
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      } finally {
        this.submitting = false;
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      const control = this.registrationForm.get(key);
      control?.markAsTouched();
    });
  }

  onCancel(): void {
    this.router.navigate(['/competitions']);
  }
}