"use client";

import React from "react";
import { BarChart3, Shield, Zap, Target, LineChart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "green" | "orange" | "peach";
  index: number;
}

const FeatureCard = ({
  icon,
  title,
  description,
  color,
  index,
}: FeatureCardProps) => {
  const colorClasses = {
    green: {
      bg: "bg-primary-green/10",
      text: "text-primary-green",
      border: "group-hover:border-primary-green/30",
      glow: "group-hover:shadow-primary-green/10",
    },
    orange: {
      bg: "bg-primary-orange/10",
      text: "text-primary-orange",
      border: "group-hover:border-primary-orange/30",
      glow: "group-hover:shadow-primary-orange/10",
    },
    peach: {
      bg: "bg-primary-peach/10",
      text: "text-primary-peach",
      border: "group-hover:border-primary-peach/30",
      glow: "group-hover:shadow-primary-peach/10",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={cn(
        "group relative p-6 sm:p-8 rounded-2xl bg-card border border-border/50 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        colors.border,
        colors.glow
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Icon */}
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110",
          colors.bg
        )}
      >
        <div className={colors.text}>{icon}</div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary-green transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>

      {/* Colored bottom accent */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl",
          color === "green" &&
            "bg-gradient-to-r from-primary-green to-primary-green/50",
          color === "orange" &&
            "bg-gradient-to-r from-primary-orange to-primary-orange/50",
          color === "peach" &&
            "bg-gradient-to-r from-primary-peach to-primary-peach/50"
        )}
      />

      {/* Decorative corner */}
      <div
        className={cn(
          "absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-bl from-current to-transparent rounded-tr-2xl"
        )}
        style={{ color: `var(--color-primary-${color})`, opacity: 0.05 }}
      />
    </div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Diverse Investment Options",
      description:
        "Explore savings, bonds, mutual funds, real estate, and more — all tailored for student budgets and goals.",
      color: "green" as const,
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Student-Safe Investing",
      description:
        "Start with low-risk options and learn responsible investing with built-in safeguards and guidance.",
      color: "orange" as const,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Micro-Investing",
      description:
        "Begin with as little as ₦1,000. Perfect for students with limited budgets who want to start building wealth.",
      color: "peach" as const,
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Goal-Based Planning",
      description:
        "Set financial goals like tuition savings, emergency funds, or post-graduation plans and track your progress.",
      color: "green" as const,
    },
    {
      icon: <LineChart className="w-7 h-7" />,
      title: "Learn While You Earn",
      description:
        "Interactive tutorials, quizzes, and real-world simulations to build your financial literacy as you invest.",
      color: "orange" as const,
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Student Community",
      description:
        "Connect with fellow student investors, share tips, join investment clubs, and learn together.",
      color: "peach" as const,
    },
  ];

  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-b from-background via-primary-green/5 to-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-green/15 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary-orange/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-primary-peach/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-40 h-40 bg-primary-peach/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-primary-orange/10 rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-green/10 text-primary-green rounded-full text-sm font-medium">
            <Zap className="w-4 h-4" />
            <span>Built for Students</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-foreground">Invest Smarter, </span>
            <span className="bg-gradient-to-r from-primary-orange to-primary-peach bg-clip-text text-transparent">
              Not Harder
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Whether it&apos;s savings, bonds, or mutual funds — we make
            investing accessible, educational, and rewarding for every student.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
