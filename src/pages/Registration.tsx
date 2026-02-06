import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, Users, CreditCard, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PRICE_PER_PERSON = 350;

interface FormData {
  name: string;
  email: string;
  participants: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  participants?: string;
}

const Registration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workshopDate = searchParams.get("date") || "";
  
  const [step, setStep] = useState<"form" | "summary" | "payment">("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    participants: 1
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "credit">("paypal");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "נא להזין שם מלא";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "השם חייב להכיל לפחות 2 תווים";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "נא להזין כתובת אימייל";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "כתובת אימייל לא תקינה";
    }

    if (formData.participants < 1 || formData.participants > 10) {
      newErrors.participants = "מספר המשתתפים חייב להיות בין 1 ל-10";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleContinueToSummary = () => {
    if (validateForm()) {
      setStep("summary");
    }
  };

  const handleContinueToPayment = () => {
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      const totalAmount = (formData.participants * PRICE_PER_PERSON).toFixed(2);
      
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          workshopDate,
          participantName: formData.name.trim(),
          participantEmail: formData.email.trim(),
          participantPhone: "",
          amount: totalAmount,
          currency: "ILS",
          participants: formData.participants,
          paymentMethod
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      if (data?.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        throw new Error('No approval URL received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בעת יצירת ההזמנה. אנא נסה שוב.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = formData.participants * PRICE_PER_PERSON;

  return (
    <div className="min-h-screen bg-background py-8 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/#registration")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לפרטי הסדנאות
        </button>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            דף זה מאובטח באמצעות PayPal
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            הרשמה לסדנה
          </h1>
          {workshopDate && (
            <p className="text-muted-foreground">
              תאריך: {workshopDate}
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === "form" ? "gradient-primary text-white" : "bg-primary/20 text-primary"
          }`}>
            1
          </div>
          <div className={`w-12 h-1 rounded ${step !== "form" ? "bg-primary" : "bg-muted"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === "summary" ? "gradient-primary text-white" : step === "payment" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
          }`}>
            2
          </div>
          <div className={`w-12 h-1 rounded ${step === "payment" ? "bg-primary" : "bg-muted"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === "payment" ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
          }`}>
            3
          </div>
        </div>

        {/* Form Step */}
        {step === "form" && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-bold mb-4 text-foreground">פרטי הרשמה</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm text-foreground">
                  שם מלא *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="הזינו את שמכם המלא"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-sm text-foreground">
                  כתובת אימייל *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-destructive" : ""}
                  maxLength={255}
                  dir="ltr"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="participants" className="text-sm text-foreground">
                  מספר משתתפים *
                </Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleInputChange("participants", Math.max(1, formData.participants - 1))}
                    disabled={formData.participants <= 1}
                  >
                    -
                  </Button>
                  <div className="w-16 text-center">
                    <Input
                      id="participants"
                      type="number"
                      min={1}
                      max={10}
                      value={formData.participants}
                      onChange={(e) => handleInputChange("participants", parseInt(e.target.value) || 1)}
                      className="text-center"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleInputChange("participants", Math.min(10, formData.participants + 1))}
                    disabled={formData.participants >= 10}
                  >
                    +
                  </Button>
                  <Users className="w-5 h-5 text-muted-foreground" />
                </div>
                {errors.participants && (
                  <p className="text-xs text-destructive mt-1">{errors.participants}</p>
                )}
              </div>

              <Button
                onClick={handleContinueToSummary}
                className="w-full gradient-primary text-white font-bold text-base py-5 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200 mt-4"
              >
                המשך לסיכום הזמנה
              </Button>
            </div>
          </div>
        )}

        {/* Summary Step */}
        {step === "summary" && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-bold mb-4 text-foreground">סיכום הזמנה</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">מספר משתתפים</span>
                <span className="font-bold text-foreground">{formData.participants}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">מחיר למשתתף</span>
                <span className="font-bold text-foreground">{PRICE_PER_PERSON} ₪</span>
              </div>
              <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-3">
                <span className="font-bold text-foreground">סה״כ לתשלום</span>
                <span className="text-xl font-bold text-primary">{totalPrice} ₪</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <h3 className="text-md font-bold mb-3 text-foreground">בחירת אמצעי תשלום</h3>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "paypal" | "credit")}
              className="space-y-3 mb-6"
            >
              <div className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "paypal" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}>
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PP</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">PayPal</p>
                    <p className="text-xs text-muted-foreground">תשלום מאובטח באמצעות PayPal</p>
                  </div>
                </Label>
              </div>

              <div className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "credit" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}>
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">כרטיס אשראי</p>
                    <p className="text-xs text-muted-foreground">תשלום ישיר בכרטיס אשראי</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                className="flex-1"
              >
                חזרה
              </Button>
              <Button
                onClick={handleContinueToPayment}
                className="flex-1 gradient-primary text-white font-bold rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
              >
                המשך לתשלום
              </Button>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              {paymentMethod === "credit" ? "תשלום בכרטיס אשראי" : "תשלום באמצעות PayPal"}
            </h2>
            
            <div className="bg-muted/50 rounded-lg p-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">סה״כ לתשלום</span>
                <span className="text-xl font-bold text-primary">{totalPrice} ₪</span>
              </div>
            </div>

            {paymentMethod === "credit" && (
              <p className="text-sm text-muted-foreground mb-4 text-center">
                תועבר לדף תשלום מאובטח של PayPal להזנת פרטי כרטיס האשראי
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("summary")}
                className="flex-1"
                disabled={isLoading}
              >
                חזרה
              </Button>
              <Button
                onClick={handlePayment}
                disabled={isLoading}
                className="flex-1 gradient-primary text-white font-bold rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin ml-2" />
                    מעבד...
                  </>
                ) : (
                  <>
                    {paymentMethod === "credit" ? (
                      <CreditCard className="w-5 h-5 ml-2" />
                    ) : null}
                    לתשלום {totalPrice} ₪
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* WhatsApp floating button */}
        <a
          href="https://wa.me/972502177897"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 z-50"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">לשאלות נוספות על הסדנה</span>
        </a>
      </div>
    </div>
  );
};

export default Registration;
