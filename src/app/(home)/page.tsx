import Hero from "@/components/ui/home/hero";
import VideoSection from "@/components/ui/home/video-section";
import FeaturesSection from "@/components/ui/home/features-section";
import TestimonialsSection from "@/components/ui/home/testimonials-section";
import PricingSection from "@/components/ui/home/pricing-section";
import CTASection from "@/components/ui/home/cta-section";
import Footer from "@/components/ui/home/footer";
import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <VideoSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
