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
    <section className="py-20 bg-muted/30" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מי מעביר את <span className="text-gradient-primary">הסדנה?</span>
          </h2>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elevated border border-border/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile image */}
              <div className="w-40 h-40 rounded-full overflow-hidden flex-shrink-0 shadow-lg">
                <img 
                  src={razProfile} 
                  alt="רז בלישה" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="flex-1 text-right">
                {/* Name and title hierarchy */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">רז בלישה</h3>
                  <p className="text-lg text-muted-foreground">
                    מומחה לאסטרטגיות חיפוש עבודה לג'וניורים בהייטק
                  </p>
                </div>

                {/* Experience card */}
                <div className="bg-muted/50 rounded-xl p-5 border border-border/30">
                  <div className="grid gap-3">
                    {highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
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
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-5"
                >
                  <Linkedin className="w-6 h-6" />
                  <span className="font-medium">הפרופיל שלי בלינקדאין</span>
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
