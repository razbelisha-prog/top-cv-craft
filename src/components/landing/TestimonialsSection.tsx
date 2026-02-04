import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  return (
    <section className="py-14 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
            <span className="text-gradient-primary">לקוחות</span> מספרים
          </h2>

          {/* Carousel */}
          <div className="px-12 md:px-16">
            <Carousel
              opts={{
                align: "center",
                loop: true,
                direction: "rtl",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {testimonialImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 basis-[280px] md:basis-[320px]">
                    <div 
                      className="rounded-2xl shadow-card border border-border/50 overflow-hidden card-interactive"
                      style={{ aspectRatio: '1080/1350' }}
                    >
                      <img 
                        src={image} 
                        alt={`המלצה ${index + 1}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="right-0 -mr-12 md:-mr-14 bg-card shadow-card btn-press hover:border-primary/30 transition-all duration-200" />
              <CarouselNext className="left-0 -ml-12 md:-ml-14 bg-card shadow-card btn-press hover:border-primary/30 transition-all duration-200" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
