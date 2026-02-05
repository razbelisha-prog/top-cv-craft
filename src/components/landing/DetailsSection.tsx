import { useState } from "react";
import { Calendar, Clock, Monitor, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const workshops = [
  {
    date: "12.02.26",
    displayDate: "12.02 (יום חמישי)",
    status: "soldOut",
    statusText: "Sold Out"
  },
  {
    date: "19.02.26",
    displayDate: "19.02 (יום חמישי)",
    status: "soldOut",
    statusText: "Sold Out"
  },
  {
    date: "26.02.26",
    displayDate: "26.02 (יום חמישי)",
    status: "open",
    statusText: "פתוח להרשמה"
  }
];

interface ParticipantForm {
  name: string;
  email: string;
  phone: string;
}

const DetailsSection = () => {
  const [formData, setFormData] = useState<ParticipantForm>({
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Partial<ParticipantForm>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ParticipantForm> = {};

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

    if (formData.phone && !/^[\d\-+() ]{7,20}$/.test(formData.phone)) {
      newErrors.phone = "מספר טלפון לא תקין";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ParticipantForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePayment = async (workshopDate: string) => {
    if (!validateForm()) {
      toast({
        title: "שגיאה בטופס",
        description: "נא למלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-paypal-order', {
        body: {
          workshopDate,
          participantName: formData.name.trim(),
          participantEmail: formData.email.trim(),
          participantPhone: formData.phone.trim(),
          amount: "350.00",
          currency: "ILS"
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to create order');
      }

      if (data?.approvalUrl) {
        // Redirect to PayPal checkout
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

  return (
    <section id="registration" className="py-14 bg-muted/30" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="text-gradient-primary">הסדנאות</span> הבאות
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => (
              <div 
                key={index} 
                className={`bg-card rounded-2xl p-5 shadow-card border ${
                  workshop.status === 'open' 
                    ? 'border-primary/30 shadow-elevated' 
                    : 'border-border/50 opacity-75'
                }`}
              >
                {/* Workshop Header */}
                <div className="text-center mb-5">
                  <p className="text-lg font-bold text-foreground mb-1">{workshop.date}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    workshop.status === 'open'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {workshop.statusText}
                  </span>
                </div>

                {/* 2x2 Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {/* תאריך */}
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-2 shadow-primary">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">תאריך</p>
                    <p className="text-sm font-bold text-foreground">{workshop.displayDate}</p>
                  </div>

                  {/* שעה */}
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-2 shadow-primary">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">שעה</p>
                    <p className="text-sm font-bold text-foreground">18:00 – 21:30</p>
                  </div>

                  {/* מיקום */}
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-2 shadow-primary">
                      <Monitor className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">מיקום</p>
                    <p className="text-sm font-bold text-foreground">Zoom</p>
                  </div>

                  {/* מחיר */}
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <div className="w-10 h-10 mx-auto rounded-lg gradient-primary flex items-center justify-center mb-2 shadow-primary">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-0.5">מחיר</p>
                    <p className="text-sm font-bold text-foreground">350 ₪</p>
                  </div>
                </div>

                {/* Registration Form - only for open workshops */}
                {workshop.status === 'open' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`name-${index}`} className="text-sm text-foreground">
                          שם מלא *
                        </Label>
                        <Input
                          id={`name-${index}`}
                          type="text"
                          placeholder="הזינו את שמכם המלא"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={errors.name ? 'border-destructive' : ''}
                          maxLength={100}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`email-${index}`} className="text-sm text-foreground">
                          אימייל *
                        </Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={errors.email ? 'border-destructive' : ''}
                          maxLength={255}
                          dir="ltr"
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`phone-${index}`} className="text-sm text-foreground">
                          טלפון (אופציונלי)
                        </Label>
                        <Input
                          id={`phone-${index}`}
                          type="tel"
                          placeholder="050-1234567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={errors.phone ? 'border-destructive' : ''}
                          maxLength={20}
                          dir="ltr"
                        />
                        {errors.phone && (
                          <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handlePayment(workshop.date)}
                      disabled={isLoading}
                      className="w-full gradient-primary text-white font-bold text-base py-5 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin ml-2" />
                          מעבד...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5 ml-2" />
                          לתשלום עם PayPal - 350 ₪
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      התשלום מאובטח באמצעות PayPal
                    </p>
                  </div>
                )}

                {workshop.status === 'soldOut' && (
                  <div className="text-center py-3 bg-muted/30 rounded-full text-muted-foreground font-medium">
                    אזלו המקומות
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
