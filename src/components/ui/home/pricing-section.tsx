"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  color: "green" | "orange" | "peach";
}

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  buttonText,
  color,
}: PricingTier) => {
  const colorClasses = {
    green: {
      badge: "bg-primary-green text-white",
      button: "bg-primary-green hover:bg-primary-green/90",
      check: "text-primary-green",
    },
    orange: {
      badge: "bg-primary-orange text-white",
      button: "bg-primary-orange hover:bg-primary-orange/90",
      check: "text-primary-orange",
    },
    peach: {
      badge: "bg-primary-peach text-white",
      button: "bg-primary-peach hover:bg-primary-peach/90",
      check: "text-primary-peach",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "relative p-6 sm:p-8 rounded-2xl transition-all duration-300",
        highlighted
          ? "bg-gradient-to-b from-primary-green/5 to-primary-green/10 border-2 border-primary-green shadow-xl shadow-primary-green/10 scale-105 z-10"
          : "bg-card border border-border/50 hover:border-primary-green/20 hover:shadow-lg"
      )}
    >
      {/* Popular Badge */}
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1.5",
              colors.badge
            )}
          >
            <Sparkles className="w-4 h-4" />
            Most Popular
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6 pt-2">
        <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{description}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl sm:text-5xl font-bold text-foreground">
            {price}
          </span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div
              className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                highlighted ? "bg-primary-green/20" : "bg-muted"
              )}
            >
              <Check className={cn("w-3 h-3", colors.check)} />
            </div>
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <Button
        className={cn(
          "w-full py-6 text-base font-semibold transition-all hover:-translate-y-0.5",
          highlighted
            ? cn(colors.button, "text-white shadow-lg")
            : "bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
        )}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const PricingSection = () => {
  const tiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      period: "month",
      description: "Perfect for beginners exploring investing",
      features: [
        "Basic portfolio tracking",
        "5 stock watchlists",
        "Daily market updates",
        "Community access",
        "Mobile app access",
      ],
      buttonText: "Get Started Free",
      color: "green",
    },
    {
      name: "Pro",
      price: "$29",
      period: "month",
      description: "For serious investors seeking an edge",
      features: [
        "Everything in Starter",
        "Unlimited watchlists",
        "Real-time alerts",
        "Advanced analytics",
        "AI recommendations",
        "Priority support",
      ],
      highlighted: true,
      buttonText: "Start Pro Trial",
      color: "green",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For teams and professional traders",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
      ],
      buttonText: "Contact Sales",
      color: "peach",
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-background via-primary-peach/5 to-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary-green/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-primary-peach/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-56 h-56 bg-primary-green/10 rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Pricing Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-foreground">Choose Your </span>
            <span className="bg-gradient-to-r from-primary-peach to-primary-orange bg-clip-text text-transparent">
              Investment Plan
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Start free and scale as you grow. All plans include a 14-day free
            trial with no credit card required.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-4 max-w-5xl mx-auto items-start">
          {tiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          All plans include SSL encryption, 99.9% uptime guarantee, and 24/7
          monitoring.
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
