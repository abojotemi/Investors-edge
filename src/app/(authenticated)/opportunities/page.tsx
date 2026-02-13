"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  Building2,
  Coins,
  PieChart,
  Landmark,
  Star,
  Shield,
  TrendingDown,
  Clock,
  DollarSign,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import PageFooter from "@/components/ui/page-footer";
import Link from "next/link";

type OpportunityType = {
  id: string;
  title: string;
  description: string;
  category: string;
  risk: "low" | "medium" | "high";
  expectedReturn: string;
  minInvestment: string;
  timeHorizon: string;
  featured?: boolean;
  trending?: boolean;
};

const categories = [
  { id: "all", label: "All Opportunities", icon: PieChart },
  { id: "stocks", label: "Stocks", icon: TrendingUp },
  { id: "real-estate", label: "Real Estate", icon: Building2 },
  { id: "crypto", label: "Cryptocurrency", icon: Coins },
  { id: "bonds", label: "Bonds", icon: Landmark },
  { id: "mutual-funds", label: "Mutual Funds", icon: PieChart },
];

const riskLevels = [
  { level: "low", label: "Low Risk", color: "bg-green-500" },
  { level: "medium", label: "Medium Risk", color: "bg-yellow-500" },
  { level: "high", label: "High Risk", color: "bg-red-500" },
];

const opportunities: OpportunityType[] = [];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function OpportunitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  const filteredOpportunities = opportunities.filter((opp) => {
    const categoryMatch =
      selectedCategory === "all" || opp.category === selectedCategory;
    const riskMatch = !selectedRisk || opp.risk === selectedRisk;
    return categoryMatch && riskMatch;
  });

  const featuredOpportunities = opportunities.filter((opp) => opp.featured);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find((c) => c.id === category);
    return cat ? cat.icon : PieChart;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 pt-24 pb-16 relative flex flex-col">
      <BackgroundCircles variant="dense" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Investment <span className="text-primary-green">Opportunities</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover curated investment options across different asset classes.
            Find the right opportunities that match your goals and risk
            tolerance.
          </p>
        </motion.div>

        {/* Featured Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-6">
            <Star className="w-6 h-6 text-primary-orange fill-primary-orange" />
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Opportunities
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredOpportunities.length !== 0 ? (
              featuredOpportunities.map((opp, index) => {
                const Icon = getCategoryIcon(opp.category);
                return (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary-green/10 rounded-xl">
                        <Icon className="w-6 h-6 text-primary-green" />
                      </div>
                      {opp.trending && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary-peach bg-primary-peach/10 px-2 py-1 rounded-full">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {opp.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(
                          opp.risk
                        )}`}
                      >
                        {opp.risk.charAt(0).toUpperCase() + opp.risk.slice(1)}{" "}
                        Risk
                      </span>
                      <span className="text-sm font-semibold text-primary-green">
                        {opp.expectedReturn}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-gray-500 col-span-full text-center py-8">
                Coming soon.
              </div>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">
              Filter Opportunities
            </h3>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">By Asset Class</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary-green text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Risk Filters */}
          <div>
            <p className="text-sm text-gray-500 mb-3">By Risk Level</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRisk(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedRisk
                    ? "bg-primary-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Risks
              </button>
              {riskLevels.map((risk) => (
                <button
                  key={risk.level}
                  onClick={() => setSelectedRisk(risk.level)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedRisk === risk.level
                      ? "bg-primary-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${risk.color}`} />
                  {risk.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Opportunities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredOpportunities.map((opp) => {
            const Icon = getCategoryIcon(opp.category);
            return (
              <motion.div
                key={opp.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-100 rounded-xl group-hover:bg-primary-green/10 transition-colors">
                    <Icon className="w-6 h-6 text-gray-600 group-hover:text-primary-green transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    {opp.trending && (
                      <TrendingUp className="w-4 h-4 text-primary-peach" />
                    )}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(
                        opp.risk
                      )}`}
                    >
                      {opp.risk.charAt(0).toUpperCase() + opp.risk.slice(1)}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
                  {opp.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {opp.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary-green" />
                    <div>
                      <p className="text-xs text-gray-400">Expected Return</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {opp.expectedReturn}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary-orange" />
                    <div>
                      <p className="text-xs text-gray-400">Min. Investment</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {opp.minInvestment}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-peach" />
                    <div>
                      <p className="text-xs text-gray-400">Time Horizon</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {opp.timeHorizon}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Risk Level</p>
                      <p className="text-sm font-semibold text-gray-900 capitalize">
                        {opp.risk}
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={`/opportunities/${opp.id}`}>
                  <Button className="w-full bg-gray-100 text-gray-700 hover:bg-primary-green hover:text-white transition-all group-hover:bg-primary-green group-hover:text-white">
                    View Details
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredOpportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <TrendingDown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters to see more options.
            </p>
          </motion.div>
        )}

        {/* CTA Section
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 bg-gradient-to-r from-primary-green to-primary-green/80 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Need Personalized Advice?</h2>
          <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
            Not sure which investment is right for you? Take our quick
            assessment to get personalized recommendations based on your goals
            and risk tolerance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/learn">
              <Button className="bg-white text-primary-green hover:bg-white/90 px-8 py-6 text-lg">
                Take Assessment
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/community">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Join Community
              </Button>
            </Link>
          </div>
        </motion.div> */}
      </div>
      {/* <PageFooter /> */}
    </div>
  );
}
