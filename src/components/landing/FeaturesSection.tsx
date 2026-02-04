import { FileText, Bot, Search, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const mainFeatures = [
  {
    icon: FileText,
    title: "קורות חיים ברמת Top 1%",
    description: "מוכנים לתפקיד מטרה"
  },
  {
    icon: FileText,
    title: "2 תבניות קו\"ח",
    description: "עברית ואנגלית"
  },
  {
    icon: Bot,
    title: "גישה ל־Custom GPTs",
    description: "ייעודיים לכתיבה ושיפור קו\"ח"
  },
  {
    icon: Search,
    title: "גישה למערכת ATS חינמית",
    description: "+ GPT לבדיקת מילות מפתח"
  }
];

const skills = [
  "בניית מבנה קו\"ח מנצח",
  "עיצוב שעובר מגייסים",
  "שימוש חכם ב־AI (בלי טקסטים גנריים)",
  "התמודדות עם פרדוקס הניסיון של ג'וניורים",
  "הבנת חוקי הגיוס בהייטק",
  "הימנעות מטעויות נפוצות",
  "בידול בשוק רווי",
  "עבודה נכונה מול ATS",
  "התאמת קו\"ח לכל משרה",
  "הגשת קו\"ח בשיטת 360°"
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

          {/* Skills we'll learn */}
          <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border/50">
            <h3 className="text-xl font-bold mb-6 text-center">יכולות שנלמד בסדנה:</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <Button 
              onClick={scrollToRegistration}
              size="lg"
              className="gradient-primary text-white font-bold text-lg px-8 py-6 rounded-full shadow-primary hover:scale-105 transition-all duration-300"
            >
              🟢 נשמע לי רלוונטי – להרשמה
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
