import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import testimonial1 from "@/assets/testimonial-1.png";
import testimonial2 from "@/assets/testimonial-2.png";
import testimonial3 from "@/assets/testimonial-3.png";
import testimonial4 from "@/assets/testimonial-4.png";
import testimonial5 from "@/assets/testimonial-5.png";

const testimonialImages = [
  testimonial1,
  testimonial2,
  testimonial3,
  testimonial4,
  testimonial5,
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialImages.length) % testimonialImages.length);
  };

  return (
    <section className="py-14 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="text-gradient-primary">לקוחות</span> מספרים
          </h2>

          {/* Carousel container */}
          <div className="relative">
            {/* Navigation buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-card -mr-4 md:-mr-6 btn-press hover:border-primary/30 transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-card -ml-4 md:-ml-6 btn-press hover:border-primary/30 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Slides container */}
            <div className="overflow-hidden mx-8 md:mx-12">
              <div 
                className="flex transition-transform duration-300 ease-out gap-4"
                style={{ transform: `translateX(${currentIndex * -280}px)` }}
              >
                {testimonialImages.map((image, index) => (
                  <div 
                    key={index}
                    className="flex-shrink-0 w-[250px] md:w-[270px] rounded-2xl shadow-card border border-border/50 overflow-hidden card-interactive"
                    style={{ aspectRatio: '1080/1350' }}
                  >
                    <img 
                      src={image} 
                      alt={`המלצה ${index + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-5">
              {testimonialImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 hover:scale-125 ${
                    index === currentIndex ? 'bg-primary scale-110' : 'bg-muted hover:bg-primary/50'
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
