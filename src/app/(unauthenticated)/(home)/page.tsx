"use client";

import Hero from "@/components/ui/home/hero";
import FeaturesSection from "@/components/ui/home/features-section";
import CTASection from "@/components/ui/home/cta-section";
import FullPageSections from "@/components/ui/home/fullpage-sections";

const sectionNames = ["Home", "Features", "Get Started", "Contact"];

const Home = () => {
  return (
    <FullPageSections sectionNames={sectionNames}>
      <Hero />
      <FeaturesSection />
      <CTASection />
    </FullPageSections>
  );
};

export default Home;
