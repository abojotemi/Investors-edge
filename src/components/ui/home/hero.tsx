import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, BarChart3 } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-green/5 via-background to-primary-orange/20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-orange/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-green/25 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-peach/15 rounded-full blur-3xl" />
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-peach/20 rounded-full blur-2xl" />
        <div className="absolute bottom-40 right-1/3 w-48 h-48 bg-primary-orange/15 rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-green/20 to-primary-green/10 text-primary-green rounded-full text-sm font-medium border border-primary-green/20 shadow-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Built for Students</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="text-foreground">Your</span>{" "}
                <span className="text-primary-peach">Student</span>
                <br />
                <span className="bg-gradient-to-r from-primary-green to-primary-green/70 bg-clip-text text-transparent">
                  Investment Edge
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Empowering students to build wealth early through smart
                investing. Learn, invest, and grow your financial future while
                still in school.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary-green hover:bg-primary-green/90 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary-green/25 transition-all hover:shadow-xl hover:shadow-primary-green/30 hover:-translate-y-0.5"
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent transition-all hover:-translate-y-0.5"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary-green/5 px-3 py-1.5 rounded-full">
                <Shield className="w-5 h-5 text-primary-green" />
                <span>Student-Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary-orange/5 px-3 py-1.5 rounded-full">
                <BarChart3 className="w-5 h-5 text-primary-orange" />
                <span>Learn as You Invest</span>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative order-1 lg:order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary-green/20 via-primary-orange/20 to-primary-peach/20 rounded-2xl blur-xl opacity-60" />

              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-primary-green/10 to-primary-orange/10 p-2 rounded-2xl">
                <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl">
                  <Image
                    src="/hero.jpg"
                    alt="Investor's Edge Dashboard"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-border/50 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary-green">
                      10K+
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Student Investors
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-primary-orange text-white rounded-full px-4 py-2 shadow-lg hidden sm:block">
                <p className="text-sm font-semibold">#1 Student Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
