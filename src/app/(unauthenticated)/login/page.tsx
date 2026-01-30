"use client";

import React from "react";
import Auth from "@/components/auth";
import { motion } from "framer-motion";
import { TrendingUp, Shield, BarChart3 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-peach/20 rounded-full"
        />
      </div>

      {/* Floating Company Logos/Tickers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Apple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.08, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-[10%] left-[8%]"
        >
          <div className="text-4xl font-bold text-gray-900 select-none">AAPL</div>
        </motion.div>
        
        {/* Microsoft */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-[15%] right-[12%]"
        >
          <div className="text-3xl font-bold text-gray-900 select-none">MSFT</div>
        </motion.div>
        
        {/* Google */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.07, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-[35%] left-[5%]"
        >
          <div className="text-2xl font-bold text-gray-900 select-none">GOOGL</div>
        </motion.div>
        
        {/* Amazon */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.05, x: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="absolute top-[45%] right-[6%]"
        >
          <div className="text-3xl font-bold text-gray-900 select-none">AMZN</div>
        </motion.div>
        
        {/* Tesla */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.06, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="absolute bottom-[30%] left-[10%]"
        >
          <div className="text-2xl font-bold text-gray-900 select-none">TSLA</div>
        </motion.div>
        
        {/* NVIDIA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.07, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-[25%] right-[8%]"
        >
          <div className="text-2xl font-bold text-gray-900 select-none">NVDA</div>
        </motion.div>
        
        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 0.05, x: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
          className="absolute bottom-[12%] left-[15%]"
        >
          <div className="text-xl font-bold text-gray-900 select-none">META</div>
        </motion.div>
        
        {/* Netflix */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.06, x: 0 }}
          transition={{ duration: 1, delay: 1.9 }}
          className="absolute bottom-[15%] right-[15%]"
        >
          <div className="text-xl font-bold text-gray-900 select-none">NFLX</div>
        </motion.div>
        
        {/* Berkshire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.04, y: 0 }}
          transition={{ duration: 1, delay: 2.1 }}
          className="absolute top-[60%] left-[3%]"
        >
          <div className="text-lg font-bold text-gray-900 select-none">BRK.A</div>
        </motion.div>
        
        {/* JPMorgan */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 0.05, y: 0 }}
          transition={{ duration: 1, delay: 2.3 }}
          className="absolute top-[5%] left-[40%]"
        >
          <div className="text-lg font-bold text-gray-900 select-none">JPM</div>
        </motion.div>
        
        {/* Visa */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.06, x: 0 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="absolute bottom-[5%] right-[35%]"
        >
          <div className="text-xl font-bold text-gray-900 select-none">V</div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-8"
        >
          {/* Logo/Brand */}
          <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 cursor-pointer">
            <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={200}
              height={40}
              className="h-10 w-auto object-contain"
            />
            </Link>
          </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground mt-2"
            >
              Sign in to start your investment journey
            </motion.p>
          </div>

          {/* Auth Component */}
          <div className="flex justify-center mb-8">
            <Auth />
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted-foreground">
                Why choose us?
              </span>
            </div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4 text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-green/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-green" />
              </div>
              <span className="text-xs text-muted-foreground">Secure</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-orange/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-orange" />
              </div>
              <span className="text-xs text-muted-foreground">Smart</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-peach/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-peach" />
              </div>
              <span className="text-xs text-muted-foreground">Growth</span>
            </div>
          </motion.div>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-center text-muted-foreground mt-6"
          >
            By signing in, you agree to our{" "}
            <Link href="#" className="text-primary-green hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary-green hover:underline">
              Privacy Policy
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
