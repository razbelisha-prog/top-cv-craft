import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 hover:bg-primary/15 transition-colors duration-200">
            <span className="text-sm font-medium text-foreground">סדנת קו״ח מנצחים להייטק</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-5 leading-tight">
            <span className="text-gradient-primary">Top 1% CV</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            סדנה מעשית לבניית קו״ח שישימו אותך ב־Top 1% של מחפשי העבודה.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-3">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-primary text-white font-bold text-base px-10 py-7 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
            >
              הרשמה לסדנה
            </Button>
            <p className="text-sm text-muted-foreground font-medium">
              מוגבל ל־12 משתתפים לכל סדנה
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
