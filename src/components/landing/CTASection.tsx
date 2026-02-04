import { Button } from "@/components/ui/button";

const CTASection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 gradient-header" dir="rtl">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-relaxed">
            99% ממחפשי העבודה מגישים את אותם קו״ח.
            <br />
            <span className="text-gradient-primary">סדנת Top 1% CV תוציא אותך מהתחרות</span>
          </h2>

          <Button 
            onClick={scrollToRegistration}
            size="lg"
            className="gradient-primary text-white font-bold text-xl px-12 py-8 rounded-full shadow-primary hover:scale-105 transition-all duration-300 border border-white/20"
          >
            שומר/ת לי מקום בסדנה
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
