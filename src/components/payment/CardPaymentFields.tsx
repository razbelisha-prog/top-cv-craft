import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';
import { usePayPalCardFields } from '@/hooks/usePayPalCardFields';

interface CardPaymentFieldsProps {
  workshopDate: string;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
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
  const {
    isLoading,
    isReady,
    isProcessing,
    isEligible,
    loadSDK,
    initializeCardFields,
    submitPayment,
  } = usePayPalCardFields({
    onApprove: onSuccess,
    onError,
  });

  // Load SDK on mount
  useEffect(() => {
    loadSDK();
  }, [loadSDK]);

  // Initialize card fields when SDK is ready
  useEffect(() => {
    if (!isLoading && !isReady) {
      initializeCardFields({
        workshopDate,
        participantName,
        participantEmail,
        participantPhone,
        amount,
        currency,
        participants,
      });
    }
  }, [isLoading, isReady, initializeCardFields, workshopDate, participantName, participantEmail, participantPhone, amount, currency, participants]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">טוען טופס תשלום...</p>
      </div>
    );
  }

  if (!isEligible && !isLoading && !isReady) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">
          תשלום בכרטיס אשראי אינו זמין כרגע. אנא נסה שוב מאוחר יותר או בחר באמצעי תשלום אחר.
        </p>
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Card Number Field */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          מספר כרטיס
        </label>
        <div 
          id="card-number-field" 
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </div>

      {/* Cardholder Name Field */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">
          שם בעל הכרטיס
        </label>
        <div 
          id="card-name-field" 
          className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
        />
      </div>

      {/* Expiry and CVV Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            תוקף
          </label>
          <div 
            id="card-expiry-field" 
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            CVV
          </label>
          <div 
            id="card-cvv-field" 
            className="h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          />
        </div>
      </div>

      {/* Security Note */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        פרטי הכרטיס מעובדים באופן מאובטח ולא נשמרים באתר
      </p>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1"
        >
          חזרה
        </Button>
        <Button
          onClick={submitPayment}
          disabled={isProcessing || !isReady}
          className="flex-1 gradient-primary text-white font-bold rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin ml-2" />
              מעבד...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 ml-2" />
              לתשלום {amount} ₪
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CardPaymentFields;
