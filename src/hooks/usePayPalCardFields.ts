import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PayPalCardFieldsOptions {
  onApprove: (orderId: string) => void;
  onError: (error: string) => void;
}

interface CardFieldsInstance {
  isEligible: () => boolean;
  NumberField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  ExpiryField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  CVVField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  NameField: (options: { placeholder: string }) => { render: (selector: string) => Promise<void> };
  submit: () => Promise<{ liabilityShift?: string }>;
  getState: () => { isFormValid: boolean };
}

interface PayPalButtonsConfig {
  fundingSource?: string;
  style?: {
    layout?: string;
    color?: string;
    shape?: string;
    label?: string;
    height?: number;
  };
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (err: Error) => void;
  onCancel: () => void;
}

interface PayPalButtonsInstance {
  render: (container: string | HTMLElement) => Promise<void>;
  close: () => void;
}

declare global {
  interface Window {
    paypal?: {
      CardFields: (options: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => void;
        onError: (err: Error) => void;
        style?: Record<string, unknown>;
      }) => CardFieldsInstance;
      Buttons: (config: PayPalButtonsConfig) => PayPalButtonsInstance;
    };
  }
}

export function usePayPalCardFields({ onApprove, onError }: PayPalCardFieldsOptions) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const cardFieldsRef = useRef<CardFieldsInstance | null>(null);
  const fieldsRenderedRef = useRef(false);

  const createOrderData = useRef<{
    workshopDate: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    amount: string;
    currency: string;
    participants: number;
  } | null>(null);

  // Load PayPal SDK with Card Fields
  const loadSDK = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get client token from backend
      const { data, error } = await supabase.functions.invoke('get-paypal-client-token');
      
      if (error || !data?.clientToken || !data?.clientId) {
        throw new Error(error?.message || 'Failed to get client token');
      }

      const { clientToken, clientId } = data;

      // Check if SDK already loaded
      if (window.paypal) {
        setIsLoading(false);
        return;
      }

      // Load PayPal SDK
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=card-fields&currency=ILS`;
      script.setAttribute('data-client-token', clientToken);
      script.async = true;

      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = () => {
        setIsLoading(false);
        onError('Failed to load PayPal SDK');
      };

      document.body.appendChild(script);
    } catch (err) {
      setIsLoading(false);
      onError(err instanceof Error ? err.message : 'Failed to initialize payment');
    }
  }, [onError]);

  // Initialize Card Fields
  const initializeCardFields = useCallback(async (orderData: {
    workshopDate: string;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    amount: string;
    currency: string;
    participants: number;
  }) => {
    if (!window.paypal?.CardFields) {
      onError('PayPal Card Fields not available');
      return;
    }

    if (fieldsRenderedRef.current) {
      return;
    }

    createOrderData.current = orderData;

    try {
      const cardFields = window.paypal.CardFields({
        createOrder: async () => {
          const { data, error } = await supabase.functions.invoke('create-paypal-order', {
            body: {
              ...createOrderData.current,
              paymentMethod: 'card',
            },
          });

          if (error || !data?.orderId) {
            throw new Error(error?.message || 'Failed to create order');
          }

          return data.orderId;
        },
        onApprove: async (data) => {
          onApprove(data.orderID);
        },
        onError: (err) => {
          onError(err.message || 'Payment failed');
        },
        style: {
          input: {
            'font-size': '16px',
            'font-family': 'inherit',
            'color': 'hsl(var(--foreground))',
          },
          '.invalid': {
            'color': 'hsl(var(--destructive))',
          },
        },
      });

      // Check eligibility
      if (!cardFields.isEligible()) {
        setIsEligible(false);
        onError('Card payments are not available for this account');
        return;
      }

      setIsEligible(true);
      cardFieldsRef.current = cardFields;

      // Render card fields
      const numberField = cardFields.NumberField({ placeholder: '1234 5678 9012 3456' });
      const expiryField = cardFields.ExpiryField({ placeholder: 'MM/YY' });
      const cvvField = cardFields.CVVField({ placeholder: 'CVV' });
      const nameField = cardFields.NameField({ placeholder: 'שם בעל הכרטיס' });

      await Promise.all([
        numberField.render('#card-number-field'),
        expiryField.render('#card-expiry-field'),
        cvvField.render('#card-cvv-field'),
        nameField.render('#card-name-field'),
      ]);

      fieldsRenderedRef.current = true;
      setIsReady(true);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to initialize card fields');
    }
  }, [onApprove, onError]);

  // Submit payment
  const submitPayment = useCallback(async () => {
    if (!cardFieldsRef.current) {
      onError('Card fields not initialized');
      return;
    }

    const state = cardFieldsRef.current.getState();
    if (!state.isFormValid) {
      onError('אנא מלא את כל פרטי הכרטיס');
      return;
    }

    setIsProcessing(true);

    try {
      await cardFieldsRef.current.submit();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  }, [onError]);

  // Cleanup
  useEffect(() => {
    return () => {
      fieldsRenderedRef.current = false;
      cardFieldsRef.current = null;
    };
  }, []);

  return {
    isLoading,
    isReady,
    isProcessing,
    isEligible,
    loadSDK,
    initializeCardFields,
    submitPayment,
  };
}
