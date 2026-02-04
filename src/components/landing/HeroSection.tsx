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
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-light/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-dark/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="text-sm font-medium text-foreground">סדנת קו״ח מנצחים להייטק</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span className="text-gradient-primary">Top 1% CV</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            סדנה מעשית לבניית קו״ח שישימו אותך ב־Top 1% של מחפשי העבודה.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-primary text-white font-bold text-lg px-10 py-7 rounded-full shadow-primary hover:scale-105 transition-all duration-300"
            >
              הרשמה לסדנה
            </Button>
            <p className="text-sm text-muted-foreground font-medium">
              מוגבל ל־12 משתתפים לכל סדנה
            </p>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
