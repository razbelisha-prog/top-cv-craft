import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    paypal?: {
      CardFields: (options: CardFieldsOptions) => CardFieldsInstance;
    };
  }
}

interface CardFieldsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (error: Error) => void;
  style?: {
    input?: Record<string, string>;
    'input.invalid'?: Record<string, string>;
    'input:focus'?: Record<string, string>;
  };
}

interface CardFieldsInstance {
  isEligible: () => boolean;
  NumberField: () => CardField;
  ExpiryField: () => CardField;
  CVVField: () => CardField;
  NameField: () => CardField;
  submit: () => Promise<void>;
}

interface CardField {
  render: (container: string | HTMLElement) => Promise<void>;
}

interface UsePayPalCardFieldsOptions {
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  createOrderData: {
    workshopDate: string;
    participantName: string;
    participantEmail: string;
    participantPhone?: string;
    amount: string;
    currency: string;
    participants: number;
  };
}

export const usePayPalCardFields = ({ onSuccess, onError, createOrderData }: UsePayPalCardFieldsOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cardFieldsRef = useRef<CardFieldsInstance | null>(null);
  const clientIdRef = useRef<string | null>(null);

  // Load PayPal SDK
  const loadPayPalSDK = useCallback(async () => {
    if (window.paypal) {
      setIsSDKReady(true);
      return;
    }

    setIsLoading(true);

    try {
      // Get client ID from edge function
      const { data, error } = await supabase.functions.invoke('get-paypal-client-id');
      
      if (error || !data?.clientId) {
        throw new Error('Failed to get PayPal client ID');
      }

      clientIdRef.current = data.clientId;

      // Load PayPal SDK script
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&components=card-fields&currency=ILS`;
      script.async = true;
      
      script.onload = () => {
        setIsSDKReady(true);
        setIsLoading(false);
      };

      script.onerror = () => {
        onError('Failed to load PayPal SDK');
        setIsLoading(false);
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error('Error loading PayPal SDK:', err);
      onError('Failed to initialize payment system');
      setIsLoading(false);
    }
  }, [onError]);

  // Initialize card fields
  const initializeCardFields = useCallback(async () => {
    if (!window.paypal || !isSDKReady) {
      return;
    }

    try {
      const cardFields = window.paypal.CardFields({
        createOrder: async () => {
          // Create order via edge function
          const { data, error } = await supabase.functions.invoke('create-paypal-order', {
            body: {
              ...createOrderData,
              paymentMethod: 'credit'
            }
          });

          if (error || !data?.orderId) {
            throw new Error(error?.message || 'Failed to create order');
          }

          return data.orderId;
        },
        onApprove: async (data) => {
          setIsProcessing(true);
          try {
            // Capture the payment
            const { data: captureData, error } = await supabase.functions.invoke('process-card-payment', {
              body: { orderId: data.orderID }
            });

            if (error || !captureData?.success) {
              throw new Error(captureData?.error || error?.message || 'Payment capture failed');
            }

            onSuccess(captureData.orderId);
          } catch (err) {
            console.error('Payment capture error:', err);
            onError(err instanceof Error ? err.message : 'Payment failed');
          } finally {
            setIsProcessing(false);
          }
        },
        onError: (err) => {
          console.error('Card fields error:', err);
          onError(err.message || 'Payment processing error');
          setIsProcessing(false);
        },
        style: {
          input: {
            'font-size': '16px',
            'font-family': 'inherit',
            'color': 'hsl(var(--foreground))',
            'padding': '12px',
          },
          'input.invalid': {
            'color': 'hsl(var(--destructive))',
          },
          'input:focus': {
            'outline': 'none',
          },
        },
      });

      // Check eligibility
      if (cardFields.isEligible()) {
        setIsEligible(true);
        cardFieldsRef.current = cardFields;
      } else {
        setIsEligible(false);
        onError('Card payments are not available for this transaction');
      }
    } catch (err) {
      console.error('Error initializing card fields:', err);
      onError('Failed to initialize card payment form');
    }
  }, [isSDKReady, createOrderData, onSuccess, onError]);

  // Render card fields to containers
  const renderCardFields = useCallback(async (
    numberContainer: string,
    expiryContainer: string,
    cvvContainer: string
  ) => {
    if (!cardFieldsRef.current || !isEligible) {
      return false;
    }

    try {
      const cardFields = cardFieldsRef.current;
      
      await Promise.all([
        cardFields.NumberField().render(numberContainer),
        cardFields.ExpiryField().render(expiryContainer),
        cardFields.CVVField().render(cvvContainer),
      ]);

      return true;
    } catch (err) {
      console.error('Error rendering card fields:', err);
      onError('Failed to render payment form');
      return false;
    }
  }, [isEligible, onError]);

  // Submit payment
  const submitPayment = useCallback(async () => {
    if (!cardFieldsRef.current) {
      onError('Payment form not initialized');
      return;
    }

    setIsProcessing(true);
    try {
      await cardFieldsRef.current.submit();
    } catch (err) {
      console.error('Payment submission error:', err);
      // Error will be handled by onError callback in CardFields
      setIsProcessing(false);
    }
  }, [onError]);

  // Cleanup
  useEffect(() => {
    return () => {
      cardFieldsRef.current = null;
    };
  }, []);

  return {
    isLoading,
    isSDKReady,
    isEligible,
    isProcessing,
    loadPayPalSDK,
    initializeCardFields,
    renderCardFields,
    submitPayment,
  };
};
