import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PayPalButtonsInstance {
  render: (container: string | HTMLElement) => Promise<void>;
  close: () => void;
}

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
}: PayPalSmartButtonsProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const buttonsInstanceRef = useRef<PayPalButtonsInstance | null>(null);

  useEffect(() => {
    const initializePayPalButtons = async () => {
      // Wait for PayPal SDK to be ready (loaded via script in index.html)
      const checkPayPal = setInterval(() => {
        if (window.paypal?.Buttons) {
          clearInterval(checkPayPal);
          renderButtons();
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkPayPal);
        if (!window.paypal?.Buttons) {
          setIsLoading(false);
          onError('לא ניתן לטעון את מערכת התשלום. אנא רעננו את הדף ונסו שוב.');
        }
      }, 10000);
    };

    const renderButtons = async () => {
      if (!window.paypal?.Buttons || !buttonsContainerRef.current) return;

      try {
        // Clean up existing buttons
        if (buttonsInstanceRef.current) {
          buttonsInstanceRef.current.close();
        }
        buttonsContainerRef.current.innerHTML = '';

        buttonsInstanceRef.current = window.paypal.Buttons({
          fundingSource: undefined, // Allow all funding sources (PayPal + Card)
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 45,
          },
          createOrder: async () => {
            setIsProcessing(true);
            try {
              const { data, error } = await supabase.functions.invoke('create-paypal-order', {
                body: {
                  workshopDate,
                  participantName,
                  participantEmail,
                  participantPhone,
                  amount,
                  currency,
                  participants,
                  paymentMethod: 'paypal',
                },
              });

              if (error) {
                throw new Error(error.message || 'Failed to create order');
              }

              if (!data?.orderId) {
                throw new Error('No order ID received');
              }

              return data.orderId;
            } catch (err) {
              setIsProcessing(false);
              const errorMessage = err instanceof Error ? err.message : 'שגיאה ביצירת ההזמנה';
              toast({
                title: 'שגיאה',
                description: errorMessage,
                variant: 'destructive',
              });
              throw err;
            }
          },
          onApprove: async (data) => {
            try {
              const { data: captureData, error } = await supabase.functions.invoke('capture-paypal-order', {
                body: {
                  orderId: data.orderID,
                },
              });

              if (error) {
                throw new Error(error.message || 'Failed to capture payment');
              }

              if (captureData?.status === 'COMPLETED') {
                onSuccess(data.orderID);
              } else {
                throw new Error('Payment was not completed');
              }
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'שגיאה בעיבוד התשלום';
              onError(errorMessage);
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err) => {
            setIsProcessing(false);
            console.error('PayPal Error:', err);
            onError('אירעה שגיאה בתהליך התשלום. אנא נסו שוב.');
          },
          onCancel: () => {
            setIsProcessing(false);
            toast({
              title: 'התשלום בוטל',
              description: 'ניתן לנסות שוב בכל עת',
            });
          },
        });

        await buttonsInstanceRef.current.render(buttonsContainerRef.current);
        setIsLoading(false);
      } catch (err) {
        console.error('Error rendering PayPal buttons:', err);
        setIsLoading(false);
        onError('שגיאה בטעינת כפתורי התשלום');
      }
    };

    initializePayPalButtons();

    return () => {
      if (buttonsInstanceRef.current) {
        buttonsInstanceRef.current.close();
      }
    };
  }, [amount, currency, workshopDate, participantName, participantEmail, participantPhone, participants, onSuccess, onError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">טוען אפשרויות תשלום...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PayPal Smart Buttons Container */}
      <div 
        ref={buttonsContainerRef}
        id="paypal-smart-buttons-container"
        className="min-h-[120px]"
        style={{ direction: 'ltr' }}
      />

      {isProcessing && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-muted-foreground">מעבד תשלום...</span>
        </div>
      )}

      {/* Security Note */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        התשלום מאובטח ומעובד על ידי PayPal
      </p>

      {/* Back Button */}
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isProcessing}
        className="w-full mt-4"
      >
        <ArrowRight className="w-4 h-4 ml-2" />
        חזרה לבחירת אמצעי תשלום
      </Button>
    </div>
  );
};

export default PayPalSmartButtons;
