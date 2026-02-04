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

          {/* Phone Frame Carousel */}
          <div className="px-12 md:px-16">
            <Carousel
              opts={{
                align: "center",
                loop: true,
                direction: "rtl",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 md:-ml-4">
                {testimonialImages.map((image, index) => (
                  <CarouselItem key={index} className="pl-3 md:pl-4 basis-[260px] md:basis-[300px]">
                    {/* Phone Frame */}
                    <div className="relative bg-[#1a1a1a] rounded-[2.5rem] p-2 shadow-elevated">
                      {/* Phone notch */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1a1a1a] rounded-b-2xl z-10" />
                      
                      {/* Phone screen */}
                      <div className="relative rounded-[2rem] overflow-hidden bg-[#e5ddd5]">
                        <img 
                          src={image} 
                          alt={`המלצה ${index + 1}`}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      
                      {/* Home indicator */}
                      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="right-0 -mr-10 md:-mr-12 bg-card shadow-card btn-press hover:border-primary/30 transition-all duration-200" />
              <CarouselNext className="left-0 -ml-10 md:-ml-12 bg-card shadow-card btn-press hover:border-primary/30 transition-all duration-200" />
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
