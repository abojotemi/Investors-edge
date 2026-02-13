"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Trophy,
  TrendingUp,
  Quote,
  Calendar,
  DollarSign,
  Target,
  Star,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import Link from "next/link";

const categories = [
  { id: "all", label: "All Stories" },
  { id: "beginner", label: "Beginner Wins" },
  { id: "retirement", label: "Retirement Goals" },
  { id: "wealth", label: "Wealth Building" },
  { id: "passive", label: "Passive Income" },
];

const stories = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "SM",
    title: "From $0 to $100,000 in 5 Years",
    category: "beginner",
    summary:
      "Starting with no savings and a modest income, I learned to invest consistently and let compound interest work its magic.",
    quote:
      "The best time to start investing was yesterday. The second best time is today.",
    achievement: "$100,000 portfolio",
    timeframe: "5 years",
    startingAmount: "$50/month",
    featured: true,
    date: "March 2024",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    avatar: "MJ",
    title: "Retired at 55 with Real Estate",
    category: "retirement",
    summary:
      "Through strategic real estate investments and REITs, I built enough passive income to retire a decade early.",
    quote:
      "Real estate wasn't just an investment for me—it became my path to freedom.",
    achievement: "Early retirement",
    timeframe: "15 years",
    startingAmount: "$10,000",
    featured: true,
    date: "February 2024",
  },
  {
    id: 3,
    name: "Emily Chen",
    avatar: "EC",
    title: "Building Generational Wealth",
    category: "wealth",
    summary:
      "As a first-generation investor, I focused on building a diversified portfolio that my children can learn from and inherit.",
    quote:
      "I'm not just investing for myself—I'm investing for the generations that come after me.",
    achievement: "$500,000+ portfolio",
    timeframe: "12 years",
    startingAmount: "$200/month",
    featured: false,
    date: "January 2024",
  },
  {
    id: 4,
    name: "David Williams",
    avatar: "DW",
    title: "$3,000/Month in Dividend Income",
    category: "passive",
    summary:
      "I focused on dividend-paying stocks and built a portfolio that now pays my monthly bills without touching the principal.",
    quote:
      "Every dividend reinvested is another brick in my financial fortress.",
    achievement: "$3,000/month passive",
    timeframe: "10 years",
    startingAmount: "$15,000",
    featured: true,
    date: "January 2024",
  },
  {
    id: 5,
    name: "Jessica Taylor",
    avatar: "JT",
    title: "From Debt to Investor in 3 Years",
    category: "beginner",
    summary:
      "After paying off $40,000 in debt, I redirected those payments into investments and never looked back.",
    quote:
      "The same discipline that paid off my debt became the foundation for building wealth.",
    achievement: "$50,000 invested",
    timeframe: "3 years",
    startingAmount: "Post-debt freedom",
    featured: false,
    date: "December 2023",
  },
  {
    id: 6,
    name: "Robert Kim",
    avatar: "RK",
    title: "Side Hustle to Full-Time Investor",
    category: "wealth",
    summary:
      "What started as a side interest in investing became my full-time focus after achieving financial independence.",
    quote: "Investing isn't just about money—it's about buying back your time.",
    achievement: "Financial independence",
    timeframe: "8 years",
    startingAmount: "$5,000",
    featured: false,
    date: "November 2023",
  },
];

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
    },
  },
};

export default function SuccessStoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredStories = stories.filter(
    (story) => selectedCategory === "all" || story.category === selectedCategory
  );

  const featuredStories = filteredStories.filter((s) => s.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 pt-24 pb-16 relative">
      <BackgroundCircles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-orange/10 text-primary-orange px-4 py-2 rounded-full mb-6">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">
              Real Stories, Real Results
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Success <span className="text-primary-green">Stories</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get inspired by real community members who achieved their financial
            goals. Your success story could be next.
          </p>
        </motion.div>

        {/* Featured Story */}
        {featuredStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-primary-green to-primary-green/80 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold">
                    {featuredStories[0].avatar}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-primary-orange fill-primary-orange" />
                    <span className="text-sm font-medium text-white/80">
                      Featured Story
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {featuredStories[0].title}
                  </h2>
                  <p className="text-lg text-white/80 mb-6">
                    {featuredStories[0].summary}
                  </p>
                  <div className="flex items-start gap-2 mb-6">
                    <Quote className="w-6 h-6 text-primary-orange flex-shrink-0" />
                    <p className="text-lg italic">{featuredStories[0].quote}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <p className="text-xs text-white/60">Achievement</p>
                      <p className="font-semibold">
                        {featuredStories[0].achievement}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <p className="text-xs text-white/60">Timeframe</p>
                      <p className="font-semibold">
                        {featuredStories[0].timeframe}
                      </p>
                    </div>
                    <div className="bg-white/10 rounded-lg px-4 py-2">
                      <p className="text-xs text-white/60">Started With</p>
                      <p className="font-semibold">
                        {featuredStories[0].startingAmount}
                      </p>
                    </div>
                  </div>
                  <p className="mt-6 text-white/60">
                    — {featuredStories[0].name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Filter by category
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredStories.map((story) => (
            <motion.div
              key={story.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
                  <span className="text-primary-green font-semibold">
                    {story.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{story.name}</p>
                  <p className="text-sm text-gray-500">{story.date}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-green transition-colors">
                {story.title}
              </h3>

              <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                {story.summary}
              </p>

              <div className="flex items-start gap-2 mb-4 bg-gray-50 rounded-lg p-3">
                <Quote className="w-4 h-4 text-primary-orange flex-shrink-0 mt-0.5" />
                <p className="text-sm italic text-gray-600 line-clamp-2">
                  {story.quote}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-primary-green/5 rounded-lg">
                  <Trophy className="w-4 h-4 text-primary-green mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Achievement</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {story.achievement}
                  </p>
                </div>
                <div className="text-center p-2 bg-primary-orange/5 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary-orange mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Timeframe</p>
                  <p className="text-xs font-semibold text-gray-900">
                    {story.timeframe}
                  </p>
                </div>
                <div className="text-center p-2 bg-primary-peach/5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary-peach mx-auto mb-1" />
                  <p className="text-xs text-gray-500">Started</p>
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {story.startingAmount}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-gray-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">Inspiring story</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-green hover:bg-primary-green/10"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No stories found
            </h3>
            <p className="text-gray-500">Try a different category.</p>
          </div>
        )}

        {/* Share Your Story CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">
            Have a Success Story to Share?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Your journey could inspire thousands of others. Share how you
            achieved your investment goals and become part of our success
            stories.
          </p>
          <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8 py-6 text-lg">
            Share Your Story
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
