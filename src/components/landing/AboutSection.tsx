import { CheckCircle, User, Linkedin } from "lucide-react";

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
              {/* Profile image placeholder */}
              <div className="w-40 h-40 rounded-full gradient-primary flex items-center justify-center shadow-primary flex-shrink-0">
                <User className="w-20 h-20 text-white" />
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold text-foreground mb-2">רז בלישה</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  יועץ קריירה, מלווה מאות מועמדים בשוק ההייטק ומנחה סדנאות קו״ח ולינקדאין עם תוצאות מוכחות.
                </p>

                <div className="grid gap-3 mb-6">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>

                <a 
                  href="https://www.linkedin.com/in/raz-belisha/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
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
