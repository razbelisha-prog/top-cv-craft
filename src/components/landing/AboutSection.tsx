import { CheckCircle, Linkedin } from "lucide-react";
import razProfile from "@/assets/raz-profile.png";

const highlights = [
  "8+ שנות ניסיון בליווי מחפשי עבודה",
  "יועץ הקריירה הרשמי של צה״ל",
  "ליווי אישי של 700+ מחפשי עבודה לתפקיד הבא",
  "הקמת 3X מרכזי קריירה מצליחים עם 1,500+ משתתפים",
  "מומחה לחיפוש עבודה ו-AI לסטודנטים וג'וניורים בהייטק"
];

const AboutSection = () => {
  return (
    <section className="py-14 bg-muted/30" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            מי מעביר את <span className="text-gradient-primary">הסדנה?</span>
          </h2>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elevated border border-border/50 card-interactive">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile image */}
              <div className="w-36 h-36 rounded-full overflow-hidden flex-shrink-0 shadow-lg ring-4 ring-primary/10">
                <img 
                  src={razProfile} 
                  alt="רז בלישה" 
                  className="w-full h-full object-cover object-center scale-150"
                />
              </div>

              <div className="flex-1 text-right">
                {/* Name and title hierarchy */}
                <div className="mb-5">
                  <h3 className="text-xl font-bold text-foreground mb-0.5">רז בלישה</h3>
                  <p className="text-base text-muted-foreground">
                    מומחה לאסטרטגיות חיפוש עבודה לג'וניורים בהייטק
                  </p>
                </div>

                {/* Experience card */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border/30">
                  <div className="grid gap-2.5">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-foreground">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LinkedIn link */}
                <a 
                  href="https://www.linkedin.com/in/raz-belisha/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-all duration-200 mt-4 hover:translate-x-[-2px]"
                >
                  <Linkedin className="w-5 h-5" />
                  <span className="font-medium text-sm">הפרופיל שלי בלינקדאין</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
