"use client";

import React from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-green via-primary-green to-primary-green/90" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-orange/30 rounded-full blur-3xl\" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-peach/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-primary-orange/25 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-1/4 w-56 h-56 bg-primary-peach/25 rounded-full blur-2xl" />

        {/* Animated circles */}
        <div className="absolute top-20 right-20 w-6 h-6 bg-primary-orange rounded-full animate-pulse shadow-lg shadow-primary-orange/50" />
        <div className="absolute bottom-32 left-32 w-4 h-4 bg-primary-peach rounded-full animate-pulse delay-150 shadow-lg shadow-primary-peach/50" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-white/70 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 left-20 w-5 h-5 bg-primary-orange/80 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/20">
            <Mail className="w-4 h-4" />
            <span>Join 10,000+ Student Investors</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Start Building Wealth{" "}
            <span className="text-primary-orange">While Still in School</span>
          </h2>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Your future self will thank you. Begin your investment journey today
            with as little as ₦1,000. No experience needed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-white text-primary-green hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            >
              Start Investing Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold transition-all hover:-translate-y-0.5 bg-transparent"
            >
              Watch How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-orange"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Start with ₦1,000</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-orange"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Student-verified</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary-orange"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Learn as you invest</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
