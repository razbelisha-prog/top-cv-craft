import { Calendar, Clock, Monitor, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const details = [
  {
    icon: Calendar,
    label: "תאריך",
    value: "02.02 (יום שני)"
  },
  {
    icon: Clock,
    label: "שעה",
    value: "18:00–21:00"
  },
  {
    icon: Monitor,
    label: "מיקום",
    value: "ZOOM"
  },
  {
    icon: CreditCard,
    label: "מחיר",
    value: "350 ₪"
  }
];

const DetailsSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="registration" className="py-20 bg-secondary/5" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            פרטי <span className="text-gradient-gold">הסדנה</span>
          </h2>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elevated border border-primary/20">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {details.map((detail, index) => (
                <div key={index} className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-xl gradient-gold flex items-center justify-center mb-3 shadow-gold">
                    <detail.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{detail.label}</p>
                  <p className="text-lg font-bold text-foreground">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-accent font-medium mb-8">
              <Users className="w-5 h-5" />
              <span>⚠️ מספר מקומות מוגבל</span>
            </div>

            <div className="text-center">
              <Button 
                onClick={scrollToRegistration}
                size="lg"
                className="gradient-gold text-primary-foreground font-bold text-xl px-12 py-8 rounded-xl shadow-gold hover:scale-105 transition-all duration-300"
              >
                🟢 אני נרשם/ת עכשיו
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
