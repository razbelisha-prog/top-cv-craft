import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Shield, Users, CreditCard, ArrowRight, MessageCircle, ExternalLink, CheckCircle, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import CardPaymentFields from "@/components/payment/CardPaymentFields";
import PayPalSmartButtons from "@/components/payment/PayPalSmartButtons";
import payboxLogo from "@/assets/paybox-logo.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PRICE_PER_PERSON = 1;

interface FormData {
  name: string;
  email: string;
  phone: string;
  participants: number;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  participants?: string;
}

const Registration = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const workshopDate = searchParams.get("date") || "";
  
  const [step, setStep] = useState<"form" | "payment" | "credit-payment" | "card-payment">("form");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    participants: 1
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "paybox">("credit");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const phoneRegex = /^[\d\-+\s()]{9,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "נא להזין מספר טלפון";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "מספר טלפון לא תקין";
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

  const handleContinueToPayment = () => {
    if (validateForm()) {
      setStep("payment");
    }
  };

  const handlePaymentMethodContinue = () => {
    if (paymentMethod === 'paybox') {
      // Redirect to PayBox external link - exact URL, no modifications
      window.location.href = 'https://links.payboxapp.com/z6Yvrszcx0b';
    } else if (paymentMethod === 'credit') {
      // כרטיס אשראי דרך PayPal Smart Buttons (מאפשר גם PayPal וגם כרטיס אשראי)
      setStep("credit-payment");
    }
  };

  // handlePayment function removed - no longer needed with new 2-step flow

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

        {/* Progress indicator - 2 steps only */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step === "form" ? "gradient-primary text-white" : "bg-primary/20 text-primary"
          }`}>
            1
          </div>
          <div className={`w-12 h-1 rounded ${step !== "form" ? "bg-primary" : "bg-muted"}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step !== "form" ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
          }`}>
            2
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
                <Label htmlFor="phone" className="text-sm text-foreground">
                  מספר טלפון *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="050-1234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-destructive" : ""}
                  maxLength={15}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-xs text-destructive mt-1">{errors.phone}</p>
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
                onClick={handleContinueToPayment}
                className="w-full gradient-primary text-white font-bold text-base py-5 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200 mt-4"
              >
                המשך לתשלום
              </Button>
            </div>
          </div>
        )}

        {/* Payment Step - Combined summary + payment method selection */}
        {step === "payment" && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-bold mb-4 text-foreground">סיכום ותשלום</h2>
            
            {/* Order Summary */}
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
              onValueChange={(value) => setPaymentMethod(value as "credit" | "paybox")}
              className="space-y-3 mb-6"
            >
              {/* Credit Card Option */}
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
                    <p className="text-xs text-muted-foreground">תשלום מאובטח באמצעות PayPal</p>
                  </div>
                </Label>
              </div>

              {/* PayBox Option */}
              <div className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentMethod === "paybox" 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}>
                <RadioGroupItem value="paybox" id="paybox" />
                <Label htmlFor="paybox" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-[#00a8e8]">
                    <img src={payboxLogo} alt="PayBox" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">PayBox</p>
                    <p className="text-xs text-muted-foreground">תשלום באמצעות PayBox</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
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
                onClick={handlePaymentMethodContinue}
                className="flex-1 gradient-primary text-white font-bold rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
              >
                {paymentMethod === "paybox" ? (
                  <>
                    <ExternalLink className="w-4 h-4 ml-2" />
                    המשך לתשלום ב-PayBox
                  </>
                ) : (
                  <>לתשלום {totalPrice} ₪</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Credit Card Payment Step - PayPal Smart Buttons (מאפשר PayPal + כרטיס אשראי) */}
        {step === "credit-payment" && (
          <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <h2 className="text-lg font-bold mb-4 text-foreground">
              תשלום בכרטיס אשראי או PayPal
            </h2>
            
            <div className="bg-muted/50 rounded-lg p-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">סה״כ לתשלום</span>
                <span className="text-xl font-bold text-primary">{totalPrice} ₪</span>
              </div>
            </div>

            <PayPalSmartButtons
              amount={totalPrice.toFixed(2)}
              currency="ILS"
              workshopDate={workshopDate}
              participantName={formData.name.trim()}
              participantEmail={formData.email.trim()}
              participantPhone={formData.phone.trim()}
              participants={formData.participants}
              allowCreditCard={true}
              onSuccess={() => {
                setStep("form"); // Hide payment buttons
                setShowSuccessModal(true);
              }}
              onError={(error) => {
                toast({
                  title: "שגיאה בתשלום",
                  description: error,
                  variant: "destructive",
                });
              }}
              onBack={() => setStep("payment")}
            />
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

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
          <DialogContent className="sm:max-w-md" dir="rtl">
            <DialogHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              <DialogTitle className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
                <PartyPopper className="w-6 h-6 text-primary" />
                תודה! ההרשמה שלך לסדנה הושלמה בהצלחה
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed text-right">
                התשלום בוצע בהצלחה, ומקומך בסדנה נשמר.
                <br />
                אנו ניצור איתך קשר בהקדם עם כל הפרטים וההנחיות לקראת הסדנה.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/");
                }}
                className="w-full gradient-primary text-white font-bold rounded-full"
              >
                חזרה לדף הראשי
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Registration;
