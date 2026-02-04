import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WorkshopStyleSection from "@/components/landing/WorkshopStyleSection";
import ProblemSection from "@/components/landing/ProblemSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ToolsSection from "@/components/landing/ToolsSection";
import FAQSection from "@/components/landing/FAQSection";
import AboutSection from "@/components/landing/AboutSection";
import DetailsSection from "@/components/landing/DetailsSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <WorkshopStyleSection />
      <ProblemSection />
      <TestimonialsSection />
      <ToolsSection />
      <FAQSection />
      <AboutSection />
      <DetailsSection />
      <CTASection />
    </main>
  );
};

export default Index;
