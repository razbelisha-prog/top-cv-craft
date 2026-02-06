// PayPal SDK Type Declarations

export interface PayPalButtonsOptions {
  style?: Record<string, unknown>;
  fundingSource?: string;
  createOrder: (data: unknown, actions: unknown) => Promise<string>;
  onApprove: (data: { orderID: string }, actions: unknown) => Promise<void>;
  onError: (err: unknown) => void;
  onCancel?: (data: unknown) => void;
}

export interface PayPalButtonsInstance {
  render: (container: string | HTMLElement) => Promise<void> | void;
  close?: () => void;
}

export interface CardFieldsInstance {
  isEligible: () => boolean;
  NumberField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  ExpiryField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  CVVField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  NameField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  submit: () => Promise<{ liabilityShift?: string }>;
  getState: () => { isFormValid: boolean };
}

export interface CardFieldsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => void;
  onError: (err: Error) => void;
  style?: Record<string, unknown>;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: PayPalButtonsOptions) => PayPalButtonsInstance;
      CardFields?: (options: CardFieldsOptions) => CardFieldsInstance;
    };
  }
}
