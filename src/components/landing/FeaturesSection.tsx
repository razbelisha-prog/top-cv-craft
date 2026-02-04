import { FileText, Bot, Search, CheckCircle, Gift, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainFeatures = [
  {
    icon: Target,
    title: "אסטרטגיית קו״ח מנצחת",
    description: "איך בונים קו״ח שמבדלים אותך מ-99% ממחפשי העבודה"
  },
  {
    icon: Bot,
    title: "מערכת AI חכמה",
    description: "לבנייה ושיפור קו״ח בצורה מדויקת"
  },
  {
    icon: FileText,
    title: "2 תבניות קו״ח מעוצבות",
    description: "ב-Canva וב-Word – בעברית ובאנגלית"
  },
  {
    icon: Bot,
    title: "גישה ל-Custom GPTs ייעודיים",
    description: "לכתיבה, שיפור והתאמת קו״ח למשרות"
  },
  {
    icon: Gift,
    title: "בונוס: אסטרטגיות חיפוש עבודה",
    description: "לסטודנטים וג'וניורים – איך מוצאים עבודה גם בלי ניסיון"
  },
  {
    icon: Search,
    title: "גישה למערכת ATS חינמית",
    description: "+ GPT ייעודי לבדיקת מילות מפתח והתאמה למשרה"
  }
];

const FeaturesSection = () => {
  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-muted/30" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מה תקבלו <span className="text-gradient-primary">בסדנה?</span>
          </h2>

          {/* Main features grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {mainFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 bg-card rounded-xl shadow-card border border-border/50 hover:border-primary/30 hover:shadow-primary transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-primary text-white font-bold text-lg px-8 py-6 rounded-full shadow-primary hover:scale-105 transition-all duration-300"
            >
              תרשום אותי – אני בפנים
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
