import { Lightbulb } from "lucide-react";

const problems = [
  "250+ קו״ח נשלחים לכל משרת ג'וניור בתוך 24 שעות",
  "90% ממחפשי העבודה בונים קו״ח בעזרת AI בלבד",
  "85% מהקו״ח נפסלים כבר בשלב הסינון האוטומטי (ATS)",
  "הזמן הממוצע שמגייס.ת מקדיש.ה לקו״ח: 10–15 שניות"
];

const ProblemSection = () => {
  return (
    <section className="py-14 bg-secondary/5" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            למה אנחנו <span className="text-gradient-primary">חייבים</span> קו״ח שונים?
          </h2>
          
          <p className="text-base text-muted-foreground text-center mb-10">
            עובדים, כותבים, משפרים – ויוצאים עם קו״ח מוכנים, חדים, מותאמים לשוק ההייטק, ולסינון אנושי של מגייסות ומערכות ATS.
          </p>

          <div className="grid gap-3.5">
            {problems.map((problem, index) => (
              <div 
                key={index}
                className="flex items-center gap-3.5 p-4 bg-card rounded-xl shadow-card border border-border/50 card-interactive hover:border-primary/30"
              >
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-base font-medium text-foreground">{problem}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
