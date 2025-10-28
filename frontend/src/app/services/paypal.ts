import { Injectable } from '@angular/core';
import { loadScript } from '@paypal/paypal-js';

export interface PayPalOrderRequest {
  amount: number;
  currency?: string;
  description?: string;
  registrationId: string;
  studentName: string;
  competitionName: string;
}

export interface PayPalPaymentResult {
  success: boolean;
  orderId?: string;
  error?: string;
  details?: any;
}

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private paypal: any = null;
  private readonly clientId: string;
  private readonly environment: 'sandbox' | 'production';

  constructor() {
    // Use sandbox for development, production for live
    this.environment = 'sandbox'; // Change to 'production' for live
    // Replace with your actual PayPal client IDs
    this.clientId = this.environment === 'sandbox' 
      ? 'AYGVbx0JIlAw3VAYQ8qcFxO_VJBFOz8nG1kqGe8_1VMnqJOV7rFXPO6_6NdRIj8LJ1pJQGKGXcQ_EwKI' // Sandbox client ID
      : 'your-production-client-id'; // Production client ID
  }

  async initializePayPal(): Promise<boolean> {
    try {
      this.paypal = await loadScript({
        clientId: this.clientId,
        currency: 'USD',
        intent: 'capture'
      });
      return !!this.paypal;
    } catch (error) {
      console.error('PayPal SDK failed to load:', error);
      return false;
    }
  }

  async createPayPalButtons(
    containerId: string, 
    orderRequest: PayPalOrderRequest
  ): Promise<PayPalPaymentResult> {
    if (!this.paypal) {
      const initialized = await this.initializePayPal();
      if (!initialized) {
        return {
          success: false,
          error: 'Failed to initialize PayPal SDK'
        };
      }
    }

    return new Promise((resolve) => {
      try {
        this.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: orderRequest.amount.toFixed(2),
                  currency_code: orderRequest.currency || 'USD'
                },
                description: orderRequest.description || 
                  `Registration for ${orderRequest.competitionName} - ${orderRequest.studentName}`,
                custom_id: orderRequest.registrationId,
                invoice_id: `REG-${orderRequest.registrationId}-${Date.now()}`
              }],
              application_context: {
                brand_name: 'RSM Math Competition',
                landing_page: 'NO_PREFERENCE',
                user_action: 'PAY_NOW'
              }
            });
          },
          
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              console.log('PayPal payment completed:', details);
              
              resolve({
                success: true,
                orderId: data.orderID,
                details: details
              });
            } catch (error) {
              console.error('Error capturing PayPal payment:', error);
              resolve({
                success: false,
                error: 'Failed to capture payment'
              });
            }
          },
          
          onError: (error: any) => {
            console.error('PayPal button error:', error);
            resolve({
              success: false,
              error: 'PayPal payment error occurred'
            });
          },
          
          onCancel: (data: any) => {
            console.log('PayPal payment cancelled:', data);
            resolve({
              success: false,
              error: 'Payment was cancelled'
            });
          }
        }).render(`#${containerId}`);
      } catch (error) {
        console.error('Error creating PayPal buttons:', error);
        resolve({
          success: false,
          error: 'Failed to create PayPal buttons'
        });
      }
    });
  }

  // For testing purposes - simulate payment success
  async simulatePayment(orderRequest: PayPalOrderRequest): Promise<PayPalPaymentResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: `TEST_ORDER_${Date.now()}`,
          details: {
            id: `TEST_PAYMENT_${Date.now()}`,
            status: 'COMPLETED',
            payer: {
              email_address: 'test@example.com',
              name: { given_name: 'Test', surname: 'User' }
            },
            purchase_units: [{
              amount: {
                value: orderRequest.amount.toFixed(2),
                currency_code: 'USD'
              }
            }]
          }
        });
      }, 2000); // Simulate 2 second processing time
    });
  }

  getEnvironmentInfo() {
    return {
      environment: this.environment,
      clientId: this.clientId
    };
  }
}