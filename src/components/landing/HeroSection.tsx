import { Button } from "@/components/ui/button";
import { Crown, ArrowDown } from "lucide-react";

const HeroSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-hero overflow-hidden" dir="rtl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Crown badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Crown className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">הכנס לעילית מחפשי העבודה</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-foreground">סדנת קו"ח </span>
            <span className="text-gradient-gold">Top 1% CV</span>
            <Crown className="inline-block w-10 h-10 md:w-14 md:h-14 text-primary mr-3 -mt-2" />
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            סדנה מעשית לבניית קו"ח שישימו אותך ב־Top 1% של מחפשי העבודה.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-gold text-primary-foreground font-bold text-lg px-10 py-7 rounded-xl shadow-gold hover:scale-105 transition-all duration-300"
            >
              👉 הרשמה לסדנה
            </Button>
            <p className="text-sm text-accent font-medium flex items-center gap-2">
              ⚠️ מספר המשתתפים מוגבל
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
