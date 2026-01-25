import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "למי הסדנה מיועדת?",
    answer: "הסדנה מיועדת לכל מי שמחפש עבודה בהייטק – ג'וניורים, מחליפי קריירה, מי שחוזר לשוק העבודה, ומי שפשוט רוצה לשפר את הקו\"ח שלו."
  },
  {
    question: "האם זה מתאים גם בלי ניסיון?",
    answer: "בהחלט! חלק משמעותי מהסדנה מוקדש להתמודדות עם פרדוקס הניסיון של ג'וניורים – איך להציג את עצמך בצורה אטרקטיבית גם בלי ניסיון תעסוקתי."
  },
  {
    question: "האם צריך ידע מוקדם?",
    answer: "לא צריך שום ידע מוקדם. נתחיל מהבסיס ונבנה יחד קו\"ח מנצח צעד אחר צעד."
  },
  {
    question: "האם יוצאים עם קו\"ח מוכנים?",
    answer: "כן! המטרה היא לצאת עם קו\"ח מוכנים לשליחה. נעבוד על הקו\"ח שלכם בזמן אמת."
  },
  {
    question: "האם מקבלים תבניות?",
    answer: "כן! תקבלו 2 תבניות מקצועיות – אחת בעברית ואחת באנגלית, פלוס גישה לכלי AI ייעודיים."
  },
  {
    question: "האם הסדנה אישית?",
    answer: "הסדנה מוגבלת לעד 12 משתתפים כדי להבטיח מענה אישי ויכולת לעזור לכל אחד."
  }
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            שאלות <span className="text-gradient-gold">נפוצות</span>
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-xl border border-border/50 px-6 shadow-card"
              >
                <AccordionTrigger className="text-right text-lg font-medium hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-base leading-relaxed">
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
