import { Bot, Brain, Search, Palette, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    icon: Sparkles,
    name: "עוזר AI אישי לבניית קו״ח",
    description: "מערכת אישית שבנינו"
  },
  {
    icon: Bot,
    name: "ChatGPT",
    description: "ניסוח חכם ולא גנרי"
  },
  {
    icon: Brain,
    name: "Gemini",
    description: "חיזוק מבני ותוכן"
  },
  {
    icon: Search,
    name: "ATS Systems",
    description: "להבין איך המערכת חושבת"
  },
  {
    icon: Palette,
    name: "Canva",
    description: "עיצוב נקי ומקצועי"
  },
  {
    icon: FileText,
    name: "Word",
    description: "קובץ קל לעריכה ולשליחה"
  }
];

const ToolsSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-14 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              הכלים שנעבוד איתם <span className="text-gradient-primary">בסדנה</span>
            </h2>
            <p className="text-base text-muted-foreground">לא תאוריה – עבודה אמיתית</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-5 bg-card rounded-xl shadow-card border border-border/50 card-interactive hover:border-primary/30 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:gradient-primary transition-all duration-200">
                  <tool.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="font-semibold text-foreground mb-0.5 text-sm leading-tight">{tool.name}</h3>
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-primary text-white font-bold text-base px-8 py-6 rounded-full shadow-primary hover:shadow-elevated btn-press transition-all duration-200"
            >
              תרשום אותי – אני בפנים
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
