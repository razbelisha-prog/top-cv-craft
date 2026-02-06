import { useEffect, useRef, useState } from 'react';
import { Loader2, CreditCard, AlertCircle } from 'lucide-react';
import { usePayPalCardFields } from '@/hooks/usePayPalCardFields';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CardPaymentFieldsProps {
  workshopDate: string;
  participantName: string;
  participantEmail: string;
  participantPhone?: string;
  amount: string;
  currency: string;
  participants: number;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  onBack: () => void;
}

const CardPaymentFields = ({
  workshopDate,
  participantName,
  participantEmail,
  participantPhone,
  amount,
  currency,
  participants,
  onSuccess,
  onError,
  onBack,
}: CardPaymentFieldsProps) => {
  const [isRendered, setIsRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    onError(errorMessage);
  };

  const {
    isLoading,
    isSDKReady,
    isEligible,
    isProcessing,
    loadPayPalSDK,
    initializeCardFields,
    renderCardFields,
    submitPayment,
  } = usePayPalCardFields({
    onSuccess,
    onError: handleError,
    createOrderData: {
      workshopDate,
      participantName,
      participantEmail,
      participantPhone,
      amount,
      currency,
      participants,
    },
  });

  // Load SDK on mount
  useEffect(() => {
    loadPayPalSDK();
  }, [loadPayPalSDK]);

  // Initialize card fields when SDK is ready
  useEffect(() => {
    if (isSDKReady && !initRef.current) {
      initRef.current = true;
      initializeCardFields();
    }
  }, [isSDKReady, initializeCardFields]);

  // Render fields when eligible
  useEffect(() => {
    if (isEligible && !isRendered) {
      const render = async () => {
        const success = await renderCardFields(
          '#card-number-container',
          '#card-expiry-container',
          '#card-cvv-container'
        );
        if (success) {
          setIsRendered(true);
        }
      };
      render();
    }
  }, [isEligible, isRendered, renderCardFields]);

  const handleSubmit = async () => {
    setError(null);
    await submitPayment();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">טוען מערכת תשלום...</p>
      </div>
    );
  }

  if (!isEligible && isSDKReady && initRef.current) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            תשלום בכרטיס אשראי אינו זמין כרגע. אנא נסה לשלם דרך PayPal.
          </AlertDescription>
        </Alert>
        <Button variant="outline" onClick={onBack} className="w-full">
          חזרה לבחירת אמצעי תשלום
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <Label className="text-sm text-foreground mb-2 block">
            מספר כרטיס אשראי
          </Label>
          <div
            id="card-number-container"
            className="h-12 border border-border rounded-lg bg-background"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-foreground mb-2 block">
              תאריך תוקף
            </Label>
            <div
              id="card-expiry-container"
              className="h-12 border border-border rounded-lg bg-background"
            />
          </div>
          <div>
            <Label className="text-sm text-foreground mb-2 block">
              CVV
            </Label>
            <div
              id="card-cvv-container"
              className="h-12 border border-border rounded-lg bg-background"
            />
          </div>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">סה״כ לתשלום</span>
          <span className="text-xl font-bold text-primary">{amount} ₪</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={isProcessing}
        >
          חזרה
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || !isRendered}
          className="flex-1 gradient-primary text-white font-bold rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              מעבד תשלום...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 ml-2" />
              לתשלום {amount} ₪
            </>
          )}
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-xs text-muted-foreground text-center">
        התשלום מאובטח ומעובד ישירות על ידי PayPal. פרטי הכרטיס אינם נשמרים באתר.
      </p>
    </div>
  );
};

export default CardPaymentFields;
