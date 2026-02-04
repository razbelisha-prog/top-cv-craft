import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Placeholder for 5 WhatsApp-style vertical screenshots
const testimonialSlots = [1, 2, 3, 4, 5];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialSlots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialSlots.length) % testimonialSlots.length);
  };

  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            מה המשתתפים אומרים <span className="text-gradient-primary">אחרי הסדנה?</span>
          </h2>

          {/* Carousel container */}
          <div className="relative">
            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-card -mr-4 md:-mr-6"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-card -ml-4 md:-ml-6"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Slides container */}
            <div className="overflow-hidden mx-8 md:mx-12">
              <div 
                className="flex transition-transform duration-300 ease-in-out gap-4"
                style={{ transform: `translateX(${currentIndex * -220}px)` }}
              >
                {testimonialSlots.map((slot, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-[200px] h-[400px] bg-card rounded-2xl shadow-card border border-border/50 flex items-center justify-center"
                  >
                    <div className="text-center text-muted-foreground">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <p className="text-sm">צילום מסך {slot}</p>
                      <p className="text-xs mt-2">(להעלאת תמונה)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonialSlots.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
