"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, BarChart3, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circles */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute -top-20 -right-20 w-96 h-96 bg-primary-green/15 rounded-full"
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary-orange/10 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-peach/20 rounded-full"
        />

        {/* Medium circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="absolute top-20 left-1/4 w-40 h-40 bg-primary-green/25 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0, x: 50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-1/4 right-20 w-32 h-32 bg-primary-orange/30 rounded-full"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0, x: -50 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 -left-16 w-48 h-48 bg-primary-peach/15 rounded-full"
        />

        {/* Small animated floating circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="absolute top-32 right-1/3 w-16 h-16 bg-primary-green/35 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-full h-full bg-primary-green/35 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-20 left-1/3 w-12 h-12 bg-primary-orange/40 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="w-full h-full bg-primary-orange/40 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="absolute top-1/3 left-20 w-8 h-8 bg-primary-peach/30 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 1,
            }}
            className="w-full h-full bg-primary-peach/30 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-1/3 right-1/4 w-10 h-10 bg-primary-green/20 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="w-full h-full bg-primary-green/20 rounded-full"
          />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="absolute top-2/3 right-10 w-6 h-6 bg-primary-orange/35 rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="w-full h-full bg-primary-orange/35 rounded-full"
          />
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
              <span className="text-foreground">What</span>{" "}
              <span className="text-primary-peach">Smart</span>
              <br />
              <span className="text-primary-green">Investors See</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              We analyze the market to identify stocks with strong potential, before they make major moves.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/login">
            <Button
              size="lg"
              className="bg-primary-green hover:bg-primary-green/90 text-white px-10 py-7 text-lg font-semibold shadow-lg shadow-primary-green/25 transition-all hover:shadow-xl hover:shadow-primary-green/30 hover:-translate-y-0.5"
            >
              Join our community
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-4 sm:gap-6 justify-center pt-8"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-border/50">
              <Shield className="w-5 h-5 text-primary-green" />
              <span>Beginner-Friendly</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-border/50">
              <BarChart3 className="w-5 h-5 text-primary-orange" />
              <span>Learn as You Invest</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-sm border border-border/50">
              <TrendingUp className="w-5 h-5 text-primary-peach" />
              <span>Start with ₦1,000</span>
            </div>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-primary-green" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-green">
                Learn...
              </p>
              {/* <p className="text-sm text-muted-foreground">Investors</p> */}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-orange" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-orange">
                Invest...
              </p>
              {/* <p className="text-sm text-muted-foreground">Invested</p> */}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary-peach" />
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-primary-peach">
                Grow
              </p>
              {/* <p className="text-sm text-muted-foreground">Universities</p> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
