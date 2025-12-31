"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  content: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
  highlight?: boolean;
}

const TestimonialCard = ({
  content,
  author,
  role,
  rating,
  highlight = false,
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        "relative p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1",
        highlight
          ? "bg-gradient-to-br from-primary-green via-primary-green to-primary-green/90 text-white shadow-xl shadow-primary-green/30"
          : "bg-gradient-to-br from-card to-primary-orange/5 border border-border/50 hover:shadow-xl hover:border-primary-orange/30 hover:from-card hover:to-primary-peach/10"
      )}
    >
      {/* Quote Icon */}
      <div
        className={cn(
          "absolute top-4 right-4 opacity-20",
          highlight ? "text-white" : "text-primary-green"
        )}
      >
        <Quote className="w-12 h-12" />
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-5 h-5",
              i < rating
                ? highlight
                  ? "text-primary-orange fill-primary-orange"
                  : "text-primary-orange fill-primary-orange"
                : highlight
                ? "text-white/30"
                : "text-muted-foreground/30"
            )}
          />
        ))}
      </div>

      {/* Content */}
      <p
        className={cn(
          "text-base sm:text-lg leading-relaxed mb-6",
          highlight ? "text-white/90" : "text-muted-foreground"
        )}
      >
        &ldquo;{content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold",
            highlight
              ? "bg-white/20 text-white"
              : "bg-primary-green/10 text-primary-green"
          )}
        >
          {author.charAt(0)}
        </div>
        <div>
          <p
            className={cn(
              "font-semibold",
              highlight ? "text-white" : "text-foreground"
            )}
          >
            {author}
          </p>
          <p
            className={cn(
              "text-sm",
              highlight ? "text-white/70" : "text-muted-foreground"
            )}
          >
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content:
        "As a 200-level student, I never thought I could start investing. This platform made it so easy — I started with just ₦5,000 and I'm already seeing growth!",
      author: "Chidi Okonkwo",
      role: "Engineering Student, UNILAG",
      rating: 5,
      highlight: false,
    },
    {
      content:
        "The educational content is amazing! I learned about savings bonds, mutual funds, and even real estate investing while managing my allowance better.",
      author: "Amara Eze",
      role: "Medical Student, UI",
      rating: 5,
      highlight: true,
    },
    {
      content:
        "I used to waste my pocket money, but now I invest a portion every month. The student community here is supportive and we share tips regularly.",
      author: "Tunde Adeyemi",
      role: "Business Student, OAU",
      rating: 5,
      highlight: false,
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center py-16 lg:py-24 bg-gradient-to-br from-primary-orange/10 via-background to-primary-peach/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary-orange/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary-peach/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary-green/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-10 w-48 h-48 bg-primary-orange/15 rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-peach/10 text-primary-peach rounded-full text-sm font-medium">
            <Star className="w-4 h-4 fill-current" />
            <span>Testimonials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-foreground">What </span>
            <span className="bg-gradient-to-r from-primary-green to-primary-orange bg-clip-text text-transparent">
              Students Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hear from students across Nigerian universities who are building
            wealth and financial literacy with our platform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
