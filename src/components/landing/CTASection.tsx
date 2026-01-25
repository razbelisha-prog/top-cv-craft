import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

const CTASection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 gradient-hero" dir="rtl">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Crown className="w-16 h-16 text-primary mx-auto mb-6" />
          
          <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
            אם נמאס לך לשלוח קו"ח בלי תגובות –
            <br />
            <span className="text-gradient-gold">זו הסדנה שחוסכת חודשים של תסכול.</span>
          </h2>

          <Button 
            onClick={scrollToRegistration}
            size="lg"
            className="gradient-gold text-primary-foreground font-bold text-xl px-12 py-8 rounded-xl shadow-gold hover:scale-105 transition-all duration-300"
          >
            🟢 שומר/ת לי מקום בסדנה
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
