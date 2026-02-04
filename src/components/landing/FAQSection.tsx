import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "למי הסדנה מיועדת?",
    answer: "הסדנה מיועדת לסטודנטים, ג'וניורים ומחפשי קריירה בתחילת הדרך, שרוצים לחפש עבודה בצורה חכמה, להתבלט בשוק תחרותי ולהגדיל משמעותית את הסיכוי לקבל זימון לראיונות."
  },
  {
    question: "כבר הייתי בסדנאות קו״ח בעבר – מה שונה כאן?",
    answer: "הדיוק. הבידול. השיטה.\nבקו״ח, שורה אחת יכולה להיות ההבדל בין זימון לראיון לדחייה אוטומטית.\nהסדנה לא עוסקת רק ב\"איך לכתוב קו״ח\", אלא בבניית מיתוג אישי מדויק – דרך עיצוב חכם, תבניות מתקדמות, מערכת AI ייעודית ואסטרטגיות שמותאמות אליכם אישית."
  },
  {
    question: "האם זה מתאים לסטודנטים ולבוגרי תואר ראשון?",
    answer: "בהחלט! חלק משמעותי מהסדנה מוקדש להתמודדות עם פרדוקס הניסיון של ג'וניורים – איך להציג את עצמך בצורה אטרקטיבית גם בלי ניסיון תעסוקתי."
  },
  {
    question: "האם אני צריך קו״ח לסדנה?",
    answer: "לא חובה להגיע עם קו״ח מוכנים. מספיק שיהיה לך תוכן כתוב על הניסיון וההשכלה שלך – את הקו״ח נבנה ונשפר יחד במהלך הסדנה."
  },
  {
    question: "מה העלות של הסדנה?",
    answer: "עלות הסדנה היא 350 ₪, והיא נמשכת כ־3.5 שעות ומתקיימת בזום."
  },
  {
    question: "האם יוצאים עם קו״ח מוכנים?",
    answer: "כן! המטרה היא לצאת עם קו״ח מוכנים לשליחה. נעבוד על הקו״ח שלכם בזמן אמת."
  },
  {
    question: "האם הסדנה אישית?",
    answer: "הסדנה מוגבלת לעד 12 משתתפים כדי להבטיח מענה אישי ויכולת לעזור לכל אחד."
  }
];

const FAQSection = () => {
  return (
    <section className="py-14 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            שאלות <span className="text-gradient-primary">נפוצות</span>
          </h2>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-5 shadow-card card-interactive hover:border-primary/20 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-right text-base font-medium hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed whitespace-pre-line">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
