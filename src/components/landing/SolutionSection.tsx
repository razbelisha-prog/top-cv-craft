import { CheckCircle } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Conclusion text - plain bold text without container */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl font-bold text-foreground mb-4">
              המסקנה ברורה:
            </p>
            <p className="text-xl md:text-2xl font-bold text-foreground mb-2">
              עלינו לבדל את עצמנו משאר מחפשי העבודה.
            </p>
            <p className="text-xl md:text-2xl font-bold text-gradient-primary">
              וקו״ח הם נקודת ההתחלה.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-10 shadow-elevated border border-primary/20">
            <div className="flex flex-col gap-4 text-right max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                זו לא הרצאה.
              </p>
              <p className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                זו סדנה מעשית.
              </p>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
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
