import { config } from '../config';
import { ApiError } from '../utils/ApiError';

interface InitializePaymentInput {
  email: string;
  amount: number; // in kobo (smallest currency unit)
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
}

interface PaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

interface InitializePaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface VerifyPaymentResponse {
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string;
  customer: {
    email: string;
  };
}

export class PaystackService {
  private baseUrl = config.paystack.baseUrl;
  private secretKey = config.paystack.secretKey;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<PaystackResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = (await response.json()) as PaystackResponse<T>;

    if (!response.ok || !data.status) {
      throw ApiError.badRequest(data.message || 'Paystack request failed');
    }

    return data;
  }

  async initializePayment(input: InitializePaymentInput) {
    const response = await this.request<InitializePaymentResponse>(
      '/transaction/initialize',
      {
        method: 'POST',
        body: JSON.stringify({
          email: input.email,
          amount: input.amount,
          reference: input.reference,
          callback_url: input.callbackUrl,
          metadata: input.metadata,
        }),
      }
    );

    return response.data;
  }

  async verifyPayment(reference: string) {
    const response = await this.request<VerifyPaymentResponse>(
      `/transaction/verify/${reference}`
    );

    return response.data;
  }

  // Verify webhook signature
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', this.secretKey)
      .update(payload)
      .digest('hex');
    return hash === signature;
  }
}

export const paystackService = new PaystackService();
