import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import '@/types/paypal';

interface PayPalSmartButtonsProps {
  amount: string;
  currency: string;
  workshopDate: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  participants: number;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
  allowCreditCard?: boolean; // אם true, מאפשר גם PayPal וגם כרטיס אשראי
}

const PayPalSmartButtons = ({
  amount,
  currency,
  workshopDate,
  participantName,
  participantEmail,
  participantPhone,
  participants,
  onSuccess,
  onError,
  onBack,
  allowCreditCard = false, // ברירת מחדל: רק PayPal
}: PayPalSmartButtonsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonsRenderedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Load PayPal SDK dynamically
  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        // Get client ID from Supabase
        const { data, error } = await supabase.functions.invoke('get-paypal-client-token');
        
        if (error || !data?.clientId) {
          onError('שגיאה בטעינת פרטי PayPal. אנא נסה שוב מאוחר יותר.');
          setIsLoading(false);
          return;
        }

        const { clientId } = data;

        // Check if SDK already loaded - if yes, use it
        if (window.paypal && window.paypal.Buttons) {
          setSdkLoaded(true);
          setIsLoading(false);
          return;
        }

        // Remove existing PayPal SDK script if exists
        const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
        if (existingScript) {
          existingScript.remove();
        }

        // Load PayPal SDK dynamically
        // אם allowCreditCard = true, מאפשר גם כרטיס אשראי
        const fundingParams = allowCreditCard 
          ? '&enable-funding=card,venmo&disable-funding=paylater'
          : '&disable-funding=paylater,card,venmo';
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=ILS${fundingParams}`;
        script.async = true;

        script.onload = () => {
          setSdkLoaded(true);
          setIsLoading(false);
        };

        script.onerror = () => {
          onError('שגיאה בטעינת PayPal SDK. אנא רענן את הדף ונסה שוב.');
          setIsLoading(false);
        };

        document.body.appendChild(script);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'שגיאה בטעינת PayPal SDK');
        setIsLoading(false);
      }
    };

    loadPayPalSDK();
  }, [onError, allowCreditCard]);

  useEffect(() => {
    if (!sdkLoaded || buttonsRenderedRef.current || !containerRef.current) return;

    const renderPayPalButtons = () => {
      if (buttonsRenderedRef.current || !containerRef.current) return;
      if (typeof window.paypal === 'undefined' || !window.paypal.Buttons) {
        return false;
      }

      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      try {
        setIsLoading(true);
        const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 50,
        },
        
        // אם allowCreditCard = true, מאפשר גם PayPal וגם כרטיס אשראי
        fundingSource: allowCreditCard ? undefined : 'paypal', // undefined = כל האפשרויות, 'paypal' = רק PayPal
        
        createOrder: async (data: any, actions: any) => {
          try {
            // קריאה ל-Supabase function ליצירת הזמנה
            const { data: orderData, error } = await supabase.functions.invoke('create-paypal-order', {
              body: {
                amount,
                currency,
                workshopDate,
                participantName,
                participantEmail,
                participantPhone,
                participants,
                paymentMethod: 'paypal',
              },
            });

            if (error || !orderData?.orderId) {
              throw new Error(error?.message || 'Failed to create order');
            }

            return orderData.orderId;
          } catch (error) {
            onError(error instanceof Error ? error.message : 'שגיאה ביצירת הזמנה');
            throw error;
          }
        },
        
        onApprove: async (data: any, actions: any) => {
          try {
            setIsLoading(true);
            const details = await actions.order.capture();
            
            // שלח את פרטי התשלום ל-Supabase function
            const { error: captureError } = await supabase.functions.invoke('capture-paypal-order', {
              body: {
                orderId: data.orderID,
                paypalDetails: details,
              },
            });

            if (captureError) {
              throw new Error(captureError.message || 'Failed to process payment');
            }

            onSuccess(data.orderID);
          } catch (error) {
            onError(error instanceof Error ? error.message : 'שגיאה בעיבוד התשלום');
          } finally {
            setIsLoading(false);
          }
        },
        
        onError: (err: any) => {
          onError(err.message || 'שגיאה בתהליך התשלום');
          setIsLoading(false);
        },
        
        onCancel: () => {
          onError('התשלום בוטל');
          setIsLoading(false);
        },
      });

        if (containerRef.current) {
          buttons.render(containerRef.current);
          buttonsRenderedRef.current = true;
          setIsLoading(false);
          return true;
        }
      } catch (error) {
        onError(error instanceof Error ? error.message : 'שגיאה בטעינת כפתורי PayPal');
        setIsLoading(false);
        return false;
      }
      return false;
    };

    // Wait for PayPal SDK to load (with retry mechanism)
    const checkPayPalSDK = () => {
      if (renderPayPalButtons()) {
        return; // Successfully rendered
      }
      
      // Retry after 500ms
      setTimeout(() => {
        if (renderPayPalButtons()) {
          return; // Successfully rendered
        }
        
        // Final check after 2 seconds
        setTimeout(() => {
          if (!renderPayPalButtons()) {
            onError('PayPal SDK לא נטען. אנא רענן את הדף ונסה שוב.');
          }
        }, 2000);
      }, 500);
    };

    // Start rendering PayPal buttons
    checkPayPalSDK();
  }, [sdkLoaded, amount, currency, workshopDate, participantName, participantEmail, participantPhone, participants, allowCreditCard, onSuccess, onError]);

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">טוען כפתורי תשלום...</p>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        id="paypal-smart-buttons-container"
        className="flex justify-center"
        dir="ltr"
      />
      
      <Button
        variant="outline"
        onClick={onBack}
        className="w-full mt-4"
        disabled={isLoading}
      >
        חזרה
      </Button>
    </div>
  );
};

export default PayPalSmartButtons;
