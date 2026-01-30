"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  ArrowRight,
  Loader2,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { cn } from "@/lib/utils";

const sectorLabels: Record<string, string> = {
  technology: "Technology",
  healthcare: "Healthcare",
  finance: "Finance",
  energy: "Energy",
  consumer: "Consumer",
  industrial: "Industrial",
  materials: "Materials",
  utilities: "Utilities",
  "real-estate": "Real Estate",
  communication: "Communication",
};

const sectorColors: Record<string, string> = {
  technology: "bg-blue-500",
  healthcare: "bg-green-500",
  finance: "bg-purple-500",
  energy: "bg-yellow-500",
  consumer: "bg-pink-500",
  industrial: "bg-gray-500",
  materials: "bg-orange-500",
  utilities: "bg-teal-500",
  "real-estate": "bg-indigo-500",
  communication: "bg-red-500",
};

export default function StocksPage() {
  const { stocks, loading } = useContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading stock recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-green/5 relative flex flex-col">
      <BackgroundCircles />
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden flex-1">
        {/* Background decorative circles */}
        <motion.div
          className="absolute top-10 right-20 w-64 h-64 rounded-full bg-primary-green/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-primary-orange/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green text-sm font-semibold mb-4">
              <TrendingUp className="w-4 h-4" />
              Stock Recommendations
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Latest Stock Updates
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Carefully researched stock picks with detailed analysis. We enter
              when the market is cold, and exit when sentiment returns.
            </p>
          </motion.div>

          {/* Stock Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stocks.length !== 0 ? (
              stocks.map((stock, index) => (
                <motion.div
                  key={stock.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/stocks/${stock.id}`}>
                    <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                      {/* Top gradient bar */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-green to-primary-orange" />

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary-green transition-colors">
                            {stock.name}
                          </h3>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary-green text-white text-sm font-semibold">
                            {stock.ticker}
                          </span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-green group-hover:translate-x-1 transition-all" />
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {stock.description}
                      </p>

                      {/* Price Targets */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                            <DollarSign className="w-3 h-3" />
                            Entry
                          </div>
                          <div className="font-semibold">
                            ₦{stock.entryPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-xs text-primary-green mb-1">
                            <Target className="w-3 h-3" />
                            Target
                          </div>
                          <div className="font-semibold text-primary-green">
                            ₦{stock.targetPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 text-xs text-red-500 mb-1">
                            <AlertTriangle className="w-3 h-3" />
                            Stop
                          </div>
                          <div className="font-semibold text-red-500">
                            ₦{stock.stopLoss.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          Added:{" "}
                          {new Date(stock.dateAdded).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium text-white",
                            sectorColors[stock.sector] || "bg-gray-500"
                          )}
                        >
                          {sectorLabels[stock.sector] || stock.sector}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-gray-500 col-span-full text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No active picks</h3>
                <p>Check back soon for new stock recommendations!</p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 p-4 bg-primary-orange/5 border border-primary-orange/20 rounded-xl text-center"
          >
            <p className="text-sm text-muted-foreground">
              <strong className="text-primary-orange">Disclaimer:</strong> These
              are educational stock analyses, not financial advice. Always do
              your own research and consult with a financial advisor before
              making investment decisions.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
