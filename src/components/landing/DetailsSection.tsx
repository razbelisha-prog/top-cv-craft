import { Calendar, Clock, Monitor, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const DetailsSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
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

                {/* CTA Button - only for open workshops */}
                {workshop.status === 'open' && (
                  <Button 
                    onClick={scrollToRegistration}
                    className="w-full gradient-primary text-white font-bold text-base py-5 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
                  >
                    אני נרשם/ת עכשיו
                  </Button>
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
