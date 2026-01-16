"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Globe,
  TrendingUp,
  Calendar,
  Building2,
  Newspaper,
  ChevronRight,
  Clock,
  BarChart3,
  Landmark,
} from "lucide-react";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import { cn } from "@/lib/utils";

type TabType = "weekly" | "sectors" | "macro";
type weeklyRecapsType = {
  id: number;
  title: string;
  date: string;
  marketSentiment: "Bullish" | "Bearish" | "Neutral";
  summary: string;
  highlights: string[];
};

type sectorWatchType = {
  id: number;
  name: string;
  trend: "up" | "down" | "neutral";
  performance: string;
  outlook: string;
  topPicks: string[];
};

type macroEventsType = {
  id: number;
  title: string;
  date: string;
  type: "Monetary Policy" | "Economic Data" | "Fiscal Policy" | "Regulatory";
  impact: "High" | "Medium" | "Low";
  description: string;
};

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  {
    id: "weekly",
    label: "Weekly Recaps",
    icon: <Calendar className="w-4 h-4" />,
  },
  {
    id: "sectors",
    label: "Sector Watch",
    icon: <Building2 className="w-4 h-4" />,
  },
  { id: "macro", label: "Macro Events", icon: <Globe className="w-4 h-4" /> },
];

const weeklyRecaps: weeklyRecapsType[] = [];

const sectorWatch: sectorWatchType[] = [];

const macroEvents: macroEventsType[] = [];

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("weekly");

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-5 h-5 text-primary-green" />;
      case "down":
        return <TrendingUp className="w-5 h-5 text-primary-peach rotate-180" />;
      default:
        return <BarChart3 className="w-5 h-5 text-primary-orange" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-primary-peach/10 text-primary-peach";
      case "Medium":
        return "bg-primary-orange/10 text-primary-orange";
      default:
        return "bg-primary-green/10 text-primary-green";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return "bg-primary-green text-white";
      case "Bearish":
        return "bg-primary-peach text-white";
      default:
        return "bg-primary-orange text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-primary-green/5 relative flex flex-col">
      <BackgroundCircles />
      {/* Hero Section */}
      <section className="relative py-16 px-4 overflow-hidden flex-1">
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
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green text-sm font-semibold mb-4">
              <Globe className="w-4 h-4" />
              Market Insights
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Stay Informed, Invest Smart
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Weekly market recaps, sector analysis, and upcoming macro events
              to help you make informed investment decisions.
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-green to-primary-green/80 text-white shadow-lg shadow-primary-green/20"
                    : "bg-white text-muted-foreground hover:text-foreground border border-border/50"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Weekly Recaps */}
            {activeTab === "weekly" && (
              <div className="space-y-6">
                {weeklyRecaps.length !== 0 ? (
                  weeklyRecaps.map((recap, index) => (
                    <motion.div
                      key={recap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary-green hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-1">
                            {recap.title}
                          </h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {recap.date}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "px-4 py-1.5 rounded-full text-sm font-semibold",
                            getSentimentColor(recap.marketSentiment)
                          )}
                        >
                          {recap.marketSentiment}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {recap.summary}
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">
                          Key Highlights:
                        </h4>
                        <ul className="space-y-1">
                          {recap.highlights.map((highlight, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <ChevronRight className="w-4 h-4 text-primary-green flex-shrink-0 mt-0.5" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    Coming soon.
                  </div>
                )}
              </div>
            )}

            {/* Sector Watch */}
            {activeTab === "sectors" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectorWatch.length !== 0 ? (
                  sectorWatch.map((sector, index) => (
                    <motion.div
                      key={sector.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-green/10 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary-green" />
                          </div>
                          <h3 className="font-bold text-foreground">
                            {sector.name}
                          </h3>
                        </div>
                        {getTrendIcon(sector.trend)}
                      </div>
                      <div className="mb-4">
                        <span
                          className={cn(
                            "text-2xl font-bold",
                            sector.trend === "up"
                              ? "text-primary-green"
                              : sector.trend === "down"
                              ? "text-primary-peach"
                              : "text-primary-orange"
                          )}
                        >
                          {sector.performance}
                        </span>
                        <span className="text-sm text-muted-foreground ml-2">
                          this week
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {sector.outlook}
                      </p>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          Top Picks
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {sector.topPicks.map((pick) => (
                            <span
                              key={pick}
                              className="px-3 py-1 rounded-full bg-primary-green/10 text-primary-green text-sm font-medium"
                            >
                              {pick}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    Coming soon.
                  </div>
                )}
              </div>
            )}

            {/* Macro Events */}
            {activeTab === "macro" && (
              <div className="space-y-4">
                {macroEvents.length !== 0 ? (
                  macroEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary-green/10 flex items-center justify-center flex-shrink-0">
                          {event.type === "Monetary Policy" ? (
                            <Landmark className="w-7 h-7 text-primary-green" />
                          ) : event.type === "Economic Data" ? (
                            <BarChart3 className="w-7 h-7 text-primary-green" />
                          ) : event.type === "Regulatory" ? (
                            <Building2 className="w-7 h-7 text-primary-green" />
                          ) : (
                            <Newspaper className="w-7 h-7 text-primary-green" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <h3 className="text-lg font-bold text-foreground">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "px-3 py-1 rounded-full text-xs font-semibold",
                                  getImpactColor(event.impact)
                                )}
                              >
                                {event.impact} Impact
                              </span>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {event.date}
                              </span>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {event.description}
                          </p>
                          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                            {event.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    Coming soon.
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Newsletter CTA
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-primary-green to-primary-green/80 rounded-2xl p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-2">Never Miss an Update</h3>
            <p className="text-white/80 mb-6">
              Get weekly market insights delivered to your inbox every Monday
              morning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
              />
              <button className="px-6 py-3 bg-white text-primary-green font-semibold rounded-xl hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div> */}
        </div>
      </section>

    </div>
  );
}
