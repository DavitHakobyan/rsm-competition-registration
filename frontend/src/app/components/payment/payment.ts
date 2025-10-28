import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

import { PayPalService, PayPalOrderRequest, PayPalPaymentResult } from '../../services/paypal';
import { RegistrationService, Registration } from '../../services/registration';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentComponent implements OnInit, OnDestroy {
  registration: Registration | null = null;
  registrationId: string | null = null;
  
  loading = false;
  paypalInitialized = false;
  paymentProcessing = false;
  paymentCompleted = false;
  paymentError: string | null = null;
  useTestPayment = true; // Set to false for actual PayPal integration

  constructor(
    private paypalService: PayPalService,
    private registrationService: RegistrationService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit(): Promise<void> {
    // Get registration ID from route
    this.registrationId = this.route.snapshot.paramMap.get('registrationId');
    
    if (this.registrationId) {
      await this.loadRegistration();
    } else {
      this.router.navigate(['/my-registrations']);
    }
  }

  async loadRegistration(): Promise<void> {
    if (!this.registrationId) return;
    
    this.loading = true;
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      // Get the specific registration by ID
      this.registration = await this.registrationService.getRegistrationById(this.registrationId);
      
      if (!this.registration) {
        this.snackBar.open('Registration not found', 'Close', { duration: 3000 });
        this.router.navigate(['/my-registrations']);
        return;
      }

      // Verify this registration belongs to the current user
      if (this.registration.parentId !== currentUser.uid) {
        this.snackBar.open('Access denied', 'Close', { duration: 3000 });
        this.router.navigate(['/my-registrations']);
        return;
      }

      if (this.registration.paid) {
        this.snackBar.open('This registration has already been paid', 'Close', { duration: 3000 });
        this.router.navigate(['/my-registrations']);
        return;
      }

      await this.initializePayment();
    } catch (error) {
      console.error('Error loading registration:', error);
      this.paymentError = 'Failed to load registration details';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    // Clean up PayPal buttons if needed
  }

  async initializePayment(): Promise<void> {
    this.loading = true;
    try {
      if (this.useTestPayment) {
        // For demo purposes, show test payment option
        this.paypalInitialized = true;
      } else {
        // Initialize actual PayPal
        this.paypalInitialized = await this.paypalService.initializePayPal();
        if (this.paypalInitialized) {
          await this.createPayPalButtons();
        }
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      this.paymentError = 'Failed to initialize payment system';
    } finally {
      this.loading = false;
    }
  }

  async createPayPalButtons(): Promise<void> {
    if (!this.registration) return;
    
    const orderRequest: PayPalOrderRequest = {
      amount: this.registration.competitionFee || 0,
      currency: 'USD',
      description: `Registration for ${this.registration.competitionName} - ${this.registration.studentName}`,
      registrationId: this.registration.id!,
      studentName: this.registration.studentName,
      competitionName: this.registration.competitionName || 'Competition'
    };

    const result = await this.paypalService.createPayPalButtons('paypal-buttons', orderRequest);
    if (!result.success) {
      this.paymentError = result.error || 'Failed to create payment buttons';
    }
  }

  async processTestPayment(): Promise<void> {
    if (!this.registration) return;
    
    this.paymentProcessing = true;
    try {
      const orderRequest: PayPalOrderRequest = {
        amount: this.registration.competitionFee || 0,
        currency: 'USD',
        description: `Registration for ${this.registration.competitionName} - ${this.registration.studentName}`,
        registrationId: this.registration.id!,
        studentName: this.registration.studentName,
        competitionName: this.registration.competitionName || 'Competition'
      };

      const result = await this.paypalService.simulatePayment(orderRequest);
      await this.handlePaymentResult(result);
    } catch (error) {
      console.error('Error processing test payment:', error);
      this.paymentError = 'Failed to process payment';
    } finally {
      this.paymentProcessing = false;
    }
  }

  async handlePaymentResult(result: PayPalPaymentResult): Promise<void> {
    if (result.success && this.registration?.id) {
      try {
        // Update registration with payment information
        await this.registrationService.updateRegistration(this.registration.id, {
          paid: true,
          paymentOrderId: result.orderId,
          paymentDetails: result.details,
          paymentDate: new Date(),
          status: 'confirmed'
        });

        this.paymentCompleted = true;
        this.snackBar.open(
          'Payment successful! Your registration is now confirmed.', 
          'Close', 
          { duration: 5000, panelClass: ['success-snackbar'] }
        );

        // Redirect to registrations page after a short delay
        setTimeout(() => {
          this.router.navigate(['/my-registrations']);
        }, 3000);

      } catch (error) {
        console.error('Error updating registration after payment:', error);
        this.paymentError = 'Payment succeeded but failed to update registration. Please contact support.';
      }
    } else {
      this.paymentError = result.error || 'Payment failed';
      this.snackBar.open(
        'Payment failed. Please try again.', 
        'Close', 
        { duration: 5000, panelClass: ['error-snackbar'] }
      );
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  onCancel(): void {
    this.router.navigate(['/my-registrations']);
  }

  retryPayment(): void {
    this.paymentError = null;
    this.initializePayment();
  }
}