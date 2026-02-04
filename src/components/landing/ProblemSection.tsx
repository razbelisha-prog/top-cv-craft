import { XCircle } from "lucide-react";

const problems = [
  "250+ קו״ח נשלחים לכל משרת ג'וניור בתוך 24 שעות",
  "90% ממחפשי העבודה בונים קו״ח בעזרת AI בלבד",
  "85% מהקו״ח נפסלים כבר בשלב הסינון האוטומטי (ATS)",
  "הזמן הממוצע שמגייס.ת מקדיש.ה לקו״ח: 10–15 שניות"
];

const ProblemSection = () => {
  return (
    <section className="py-20 bg-secondary/5" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            למה אנחנו <span className="text-gradient-primary">חייבים</span> קו״ח שונים?
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-12">
            ככה זה לחפש עבודה ב־2026:
          </p>

          <div className="grid gap-4 md:gap-6">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-5 bg-card rounded-xl shadow-card border border-border/50 hover:border-accent/30 transition-all duration-300"
              >
                <XCircle className="w-6 h-6 text-accent flex-shrink-0" />
                <p className="text-lg font-medium text-foreground">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
