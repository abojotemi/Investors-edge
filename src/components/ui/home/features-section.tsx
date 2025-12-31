"use client";

import React from "react";
import { BarChart3, Shield, Zap, Target, LineChart, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cn(
        "group relative p-6 sm:p-8 rounded-2xl bg-white border border-white/50 transition-shadow duration-300",
        "hover:shadow-2xl shadow-lg",
        colors.border,
        colors.glow
      )}
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 200,
        }}
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-5",
          colors.bg
        )}
      >
        <div className={colors.text}>{icon}</div>
      </motion.div>

      {/* Content */}
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        className="text-xl font-bold text-foreground mb-3 group-hover:text-primary-green transition-colors"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
        className="text-muted-foreground leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Colored bottom accent */}
      <div
        className={cn(
          "absolute bottom-0 left-3 right-3 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl",
          color === "green" && "bg-primary-green",
          color === "orange" && "bg-primary-orange",
          color === "peach" && "bg-primary-peach"
        )}
      />

      {/* Decorative corner circle */}
      <div
        className={cn(
          "absolute top-2 right-2 w-8 h-8 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full",
          color === "green" && "bg-primary-green",
          color === "orange" && "bg-primary-orange",
          color === "peach" && "bg-primary-peach"
        )}
      />
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: "Diverse Investment Options",
      description:
        "Explore savings, bonds, mutual funds, real estate, and more — all tailored to fit your budget and goals.",
      color: "green" as const,
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Safe & Secure Investing",
      description:
        "Start with low-risk options and learn responsible investing with built-in safeguards and expert guidance.",
      color: "orange" as const,
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Micro-Investing",
      description:
        "Begin with as little as ₦1,000. Perfect for anyone looking to start building wealth without a large capital.",
      color: "peach" as const,
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Goal-Based Planning",
      description:
        "Set financial goals like emergency funds, retirement savings, or major purchases and track your progress.",
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
      title: "Investor Community",
      description:
        "Connect with fellow investors, share tips, join investment clubs, and learn from experienced traders.",
      color: "peach" as const,
    },
  ];

  return (
    <section className="relative min-h-screen py-16 pb-24 lg:py-24 bg-primary-peach">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circles */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, x: 100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/20 rounded-full translate-x-1/3 -translate-y-1/4"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, x: -100 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-orange/25 rounded-full -translate-x-1/4 translate-y-1/4"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-green/15 rounded-full"
        />

        {/* Medium circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute top-1/4 left-10 w-48 h-48 bg-white/25 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 30 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-1/4 right-16 w-40 h-40 bg-primary-orange/30 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="absolute top-2/3 left-1/3 w-36 h-36 bg-primary-green/20 rounded-full"
        />

        {/* Small animated floating circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="absolute top-20 left-1/4 w-20 h-20 bg-white/30 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-full h-full bg-white/30 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-32 right-1/3 w-14 h-14 bg-primary-orange/35 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="w-full h-full bg-primary-orange/35 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute top-1/2 right-20 w-10 h-10 bg-primary-green/25 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-full h-full bg-primary-green/25 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-20 left-20 w-8 h-8 bg-white/40 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="w-full h-full bg-white/40 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="absolute top-1/3 left-1/2 w-6 h-6 bg-primary-orange/40 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-full h-full bg-primary-orange/40 rounded-full"
          />
        </motion.div>
      </div>
      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 text-primary-green rounded-full text-sm font-medium shadow-md"
          >
            <Zap className="w-4 h-4" />
            <span>Built for Everyone</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            <span className="text-primary-green">Invest Smarter, </span>
            <span className="text-white">Not Harder</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-white/90 leading-relaxed"
          >
            Whether it&apos;s savings, bonds, or mutual funds — we make
            investing accessible, educational, and rewarding for everyone.
          </motion.p>
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
