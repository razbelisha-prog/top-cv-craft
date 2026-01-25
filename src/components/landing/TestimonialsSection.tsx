import { Quote, Linkedin } from "lucide-react";

const testimonials = [
  {
    quote: "זו הפעם הראשונה שהבנתי למה הקו\"ח שלי לא עובדים",
    name: "מיכל כ.",
    role: "ג'וניורית QA"
  },
  {
    quote: "יצאתי עם קו\"ח שמביא פניות",
    name: "אור ל.",
    role: "Full Stack Developer"
  },
  {
    quote: "מעשי, חד, בלי בזבוז זמן",
    name: "נועה ש.",
    role: "Product Manager"
  },
  {
    quote: "בזכות הסדנה קיבלתי 3 ראיונות בשבוע הראשון",
    name: "יונתן מ.",
    role: "Data Analyst"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מה משתתפים אומרים <span className="text-gradient-gold">אחרי הסדנה?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="relative p-6 bg-card rounded-xl shadow-card border border-border/50 hover:shadow-elevated transition-all duration-300"
              >
                <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                <p className="text-lg font-medium text-foreground mb-4 pr-2">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                  <Linkedin className="w-5 h-5 text-secondary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
