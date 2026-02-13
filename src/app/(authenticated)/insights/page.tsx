"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  Loader2,
  X,
  ArrowLeft,
  Sparkles,
  CalendarDays,
} from "lucide-react";
import PageFooter from "@/components/ui/page-footer";
import BackgroundCircles from "@/components/ui/background-circles";
import RichTextViewer from "@/components/ui/rich-text-viewer";
import { cn } from "@/lib/utils";
import type { WeeklyRecap } from "@/types/admin";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

type TabType = "weekly" | "sectors" ;

type sectorWatchType = {
  id: number;
  name: string;
  trend: "up" | "down" | "neutral";
  performance: string;
  outlook: string;
  topPicks: string[];
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
];

const sectorWatch: sectorWatchType[] = [
  {
    id: 1,
    name: "Agriculture",
    trend: "up",
    performance: "+3.2%",
    outlook:
      "Strong demand for agro-commodities and government support driving growth in the sector.",
    topPicks: ["OKOMUOIL", "PRESCO", "LIVESTOCK"],
  },
  {
    id: 2,
    name: "Banking",
    trend: "up",
    performance: "+5.1%",
    outlook:
      "Recapitalization efforts and strong earnings reports boosting investor confidence.",
    topPicks: ["GTCO", "ZENITHBANK", "ACCESSCORP", "UBA"],
  },
  {
    id: 3,
    name: "Consumer Goods",
    trend: "down",
    performance: "-1.8%",
    outlook:
      "Rising input costs and inflationary pressures weighing on margins despite resilient demand.",
    topPicks: ["NESTLE", "BUA FOODS", "DANGSUGAR"],
  },
  {
    id: 4,
    name: "Industrial Goods",
    trend: "up",
    performance: "+4.7%",
    outlook:
      "Infrastructure spending and construction activity fueling demand for cement and building materials.",
    topPicks: ["DANGCEM", "BUA CEMENT", "WAPCO"],
  },
  {
    id: 5,
    name: "Insurance",
    trend: "neutral",
    performance: "+0.4%",
    outlook:
      "Sector consolidation underway with recapitalization requirements creating both risks and opportunities.",
    topPicks: ["AIICO", "CORNERST", "MANSARD"],
  },
  {
    id: 6,
    name: "Oil & Gas",
    trend: "up",
    performance: "+6.3%",
    outlook:
      "Higher crude oil prices and PIA reforms attracting renewed investment into the sector.",
    topPicks: ["SEPLAT", "TOTAL", "OANDO"],
  },
  {
    id: 7,
    name: "Healthcare",
    trend: "neutral",
    performance: "+0.9%",
    outlook:
      "Growing health awareness and local manufacturing push, but FX challenges persist.",
    topPicks: ["FIDSON", "GLAXOSMITH", "NEIMETH"],
  },
  {
    id: 8,
    name: "ICT",
    trend: "up",
    performance: "+3.8%",
    outlook:
      "Digital transformation and growing data demand continuing to drive tech sector performance.",
    topPicks: ["MTNN", "AIRTELAFRI", "CWG"],
  },
  {
    id: 9,
    name: "Real Estate",
    trend: "down",
    performance: "-0.6%",
    outlook:
      "High interest rates dampening property demand, though select REITs remain attractive.",
    topPicks: ["UPDC", "UACN PROP", "AFRILAND"],
  },
];

const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("weekly");
  const [weeklyRecaps, setWeeklyRecaps] = useState<WeeklyRecap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecap, setSelectedRecap] = useState<WeeklyRecap | null>(null);

  // Real-time listener for published weekly recaps
  useEffect(() => {
    const recapsQuery = query(
      collection(db, "weeklyRecaps"),
      where("status", "==", "published"),
      orderBy("weekStartDate", "desc")
    );

    const unsubscribe = onSnapshot(
      recapsQuery,
      (snapshot) => {
        const fetchedRecaps: WeeklyRecap[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            weekStartDate: convertTimestamp(data.weekStartDate),
            weekEndDate: convertTimestamp(data.weekEndDate),
            content: data.content || "",
            highlights: data.highlights || [],
            status: data.status,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          } as WeeklyRecap;
        });
        setWeeklyRecaps(fetchedRecaps);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recaps:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    const startStr = start.toLocaleDateString("en-US", options);
    const endStr = end.toLocaleDateString("en-US", {
      ...options,
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 relative flex flex-col">
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
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                  </div>
                ) : weeklyRecaps.length !== 0 ? (
                  weeklyRecaps.map((recap, index) => (
                    <motion.div
                      key={recap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedRecap(recap)}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-green/20 to-primary-green/5 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <CalendarDays className="w-7 h-7 text-primary-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-muted-foreground">
                              {formatDateRange(
                                recap.weekStartDate,
                                recap.weekEndDate
                              )}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary-green transition-colors">
                            {recap.title}
                          </h3>
                          {recap.highlights.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <Sparkles className="w-4 h-4 text-primary-orange" />
                              <span className="text-sm text-muted-foreground">
                                {recap.highlights.length} key highlight
                                {recap.highlights.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-green group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>No weekly recaps yet. Check back soon!</p>
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

          </motion.div>
        </div>
      </section>

      {/* Recap Detail Modal */}
      <AnimatePresence>
        {selectedRecap && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecap(null)}
              className="fixed inset-0 bg-black/50 z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <button
                  onClick={() => setSelectedRecap(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Recaps
                </button>
                <button
                  onClick={() => setSelectedRecap(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="max-w-3xl mx-auto">
                  {/* Date */}
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-primary-green" />
                    <span className="text-primary-green font-medium">
                      {formatDateRange(
                        selectedRecap.weekStartDate,
                        selectedRecap.weekEndDate
                      )}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {selectedRecap.title}
                  </h1>

                  {/* Highlights */}
                  {selectedRecap.highlights.length > 0 && (
                    <div className="bg-primary-green/5 rounded-xl p-6 mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-primary-orange" />
                        <h2 className="text-lg font-semibold text-gray-900">
                          Key Highlights
                        </h2>
                      </div>
                      <ul className="space-y-2">
                        {selectedRecap.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-gray-700"
                          >
                            <span className="w-6 h-6 bg-primary-green text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Full Content */}
                  <div className="prose prose-lg max-w-none">
                    <RichTextViewer content={selectedRecap.content} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

