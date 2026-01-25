import { CheckCircle, User } from "lucide-react";

const highlights = [
  "ניסיון של ~10 שנים בליווי קריירה",
  "עבודה עם ג'וניורים, מיד וסניורים",
  "התמחות ב־ATS, AI ו־Recruitment Thinking",
  "ליווי עד ראיונות – לא רק עד קובץ"
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-secondary/5" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מי מעביר את <span className="text-gradient-gold">הסדנה?</span>
          </h2>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elevated border border-border/50">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile image placeholder */}
              <div className="w-40 h-40 rounded-full gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
                <User className="w-20 h-20 text-primary-foreground" />
              </div>

              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold text-foreground mb-2">רז בלישה</h3>
                <p className="text-lg text-muted-foreground mb-6">
                  יועץ קריירה, מלווה מאות מועמדים בשוק ההייטק ומנחה סדנאות קו"ח ולינקדאין עם תוצאות מוכחות.
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2 text-foreground">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
