"use client";

import React from "react";
import { TrendingUp, Users, DollarSign, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  suffix?: string;
  color: "green" | "orange" | "peach";
}

const StatCard = ({ icon, value, label, suffix, color }: StatCardProps) => {
  const colorClasses = {
    green: "from-primary-green to-primary-green/70",
    orange: "from-primary-orange to-primary-orange/70",
    peach: "from-primary-peach to-primary-peach/70",
  };

  return (
    <div className="relative group">
      <div className="text-center p-6 sm:p-8">
        {/* Icon */}
        <div
          className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg transition-transform duration-300 group-hover:scale-110",
            colorClasses[color]
          )}
        >
          {icon}
        </div>

        {/* Value */}
        <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          {value}
          {suffix && (
            <span className="text-2xl sm:text-3xl text-muted-foreground">
              {suffix}
            </span>
          )}
        </div>

        {/* Label */}
        <p className="text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "50K",
      suffix: "+",
      label: "Active Investors",
      color: "green" as const,
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "$2.5B",
      suffix: "",
      label: "Assets Tracked",
      color: "orange" as const,
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "24.5",
      suffix: "%",
      label: "Avg. Portfolio Growth",
      color: "peach" as const,
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "4.9",
      suffix: "/5",
      label: "User Rating",
      color: "green" as const,
    },
  ];

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-green via-primary-green/95 to-primary-green" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-peach/10 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Thousands of Investors
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join a growing community of successful investors who trust our
            platform for their financial journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-colors"
            >
              <StatCard {...stat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
