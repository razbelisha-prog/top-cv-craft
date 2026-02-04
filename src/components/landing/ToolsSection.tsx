import { Bot, Brain, Search, Palette, FileText } from "lucide-react";

const tools = [
  {
    icon: Bot,
    name: "ChatGPT",
    description: "ניסוח חכם ולא גנרי"
  },
  {
    icon: Brain,
    name: "Gemini",
    description: "חיזוק מבני ותוכן"
  },
  {
    icon: Search,
    name: "ATS Systems",
    description: "להבין איך המערכת חושבת"
  },
  {
    icon: Palette,
    name: "Canva",
    description: "עיצוב נקי ומקצועי"
  },
  {
    icon: FileText,
    name: "Word",
    description: "קובץ קל לעריכה ולשליחה"
  }
];

const ToolsSection = () => {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              הכלים שנעבוד איתם <span className="text-gradient-primary">בסדנה</span>
            </h2>
            <p className="text-lg text-muted-foreground">לא תאוריה – עבודה אמיתית</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {tools.map((tool, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-card border border-border/50 hover:border-primary/30 hover:shadow-primary transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:gradient-primary transition-all duration-300">
                  <tool.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{tool.name}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;
