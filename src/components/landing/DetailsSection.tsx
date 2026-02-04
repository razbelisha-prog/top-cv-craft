import { Calendar, Clock, Monitor, CreditCard, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const details = [
  {
    icon: Calendar,
    label: "תאריך",
    value: "26.02 (יום חמישי)"
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
    <section id="registration" className="py-14 bg-muted/30" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            פרטי <span className="text-gradient-primary">הסדנה</span>
          </h2>

          <div className="bg-card rounded-2xl p-7 md:p-9 shadow-elevated border border-primary/20">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
              {details.map((detail, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 mx-auto rounded-xl gradient-primary flex items-center justify-center mb-2.5 shadow-primary group-hover:scale-105 transition-transform duration-200">
                    <detail.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5">{detail.label}</p>
                  <p className="text-base font-bold text-foreground">{detail.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              <span>מוגבל ל־12 משתתפים בלבד</span>
            </div>

            <div className="text-center">
              <Button 
                onClick={scrollToRegistration}
                size="lg"
                className="gradient-primary text-white font-bold text-lg px-10 py-7 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
              >
                אני נרשם/ת עכשיו
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailsSection;
