import { CheckCircle } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-14 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Conclusion text - plain bold text without container */}
          <div className="mb-10">
            <p className="text-lg md:text-xl font-bold text-foreground mb-3">
              המסקנה ברורה:
            </p>
            <p className="text-lg md:text-xl font-bold text-foreground mb-1.5">
              עלינו לבדל את עצמנו משאר מחפשי העבודה.
            </p>
            <p className="text-lg md:text-xl font-bold text-gradient-primary">
              וקו״ח הם נקודת ההתחלה.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elevated border border-primary/20 card-interactive">
            <div className="flex flex-col gap-3 text-right max-w-2xl mx-auto">
              <p className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                זו לא הרצאה.
              </p>
              <p className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                זו סדנה מעשית.
              </p>
              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                עובדים, כותבים, משפרים – ויוצאים עם קו״ח מוכנים, חדים, מותאמים לשוק ההייטק, ולסינון אנושי של מגייסות ומערכות ATS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
