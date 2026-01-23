"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Video,
  FileText,
  Zap,
  Play,
  Download,
  Clock,
  Calendar,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { cn } from "@/lib/utils";

type TabType = "videos" | "downloads" | "articles" | "tips";

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "videos", label: "Videos", icon: <Video className="w-4 h-4" /> },
  // {
  //   id: "downloads",
  //   label: "Downloads",
  //   icon: <FileDown className="w-4 h-4" />,
  // },
  { id: "articles", label: "Articles", icon: <FileText className="w-4 h-4" /> },
  { id: "tips", label: "Quick Tips", icon: <Zap className="w-4 h-4" /> },
];

const downloads = [
  {
    id: 1,
    name: "Presentation — Portfolio Basics.pdf",
    type: "PDF",
    size: "2.4 MB",
    icon: "📄",
  },
  {
    id: 2,
    name: "Chapter 1 — The Journey.pdf",
    type: "PDF",
    size: "1.8 MB",
    icon: "📄",
  },
  {
    id: 3,
    name: "Compounding Calculator.xlsx",
    type: "Excel",
    size: "156 KB",
    icon: "📊",
  },
  {
    id: 4,
    name: "Stock Analysis Template.xlsx",
    type: "Excel",
    size: "245 KB",
    icon: "📊",
  },
  {
    id: 5,
    name: "Investment Checklist.pdf",
    type: "PDF",
    size: "890 KB",
    icon: "📄",
  },
  {
    id: 6,
    name: "Budget Tracker Template.xlsx",
    type: "Excel",
    size: "320 KB",
    icon: "📊",
  },
];

const tips = [
  "Don't chase trending tickers. Enter when the market is cold — patience matters.",
  "Use limit orders for initial entries to avoid buying at spikes.",
  "Keep a trade journal — record reasons to enter/exit every position.",
  "Diversify across sectors to reduce portfolio risk.",
  "Set your stop-loss before entering any trade, not after.",
  "Review your portfolio quarterly, not daily. Avoid emotional decisions.",
  "Start small and scale up as you gain confidence and knowledge.",
  "Never invest money you can't afford to lose or may need soon.",
];

const categoryColors: Record<string, string> = {
  // Video categories
  beginner: "bg-primary-green text-white",
  intermediate: "bg-primary-orange text-white",
  advanced: "bg-red-500 text-white",
  "market-analysis": "bg-blue-500 text-white",
  tutorials: "bg-purple-500 text-white",
  webinars: "bg-indigo-500 text-white",
  // Article categories
  "investing-basics": "bg-primary-green text-white",
  "market-news": "bg-blue-500 text-white",
  strategies: "bg-primary-orange text-white",
  "personal-finance": "bg-teal-500 text-white",
  crypto: "bg-yellow-500 text-black",
  "real-estate": "bg-amber-600 text-white",
  // Legacy categories
  "Getting Started": "bg-primary-green text-white",
  "Savings & Budgeting": "bg-primary-orange text-white",
  "Investment Types": "bg-primary-peach text-white",
  Fundamentals: "bg-primary-green text-white",
  Strategy: "bg-primary-orange text-white",
};

// Video Card Component matching the home page style
const VideoCard = ({
  id,
  title,
  description,
  duration,
  thumbnailUrl,
  category,
  index,
}: {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl?: string;
  category: string;
  index: number;
}) => {
  return (
    <Link href={`/learn/videos/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
      >
        {/* Video Thumbnail / Placeholder */}
        <div className="relative aspect-video bg-gradient-to-br from-primary-green/20 via-primary-orange/10 to-primary-peach/20 overflow-hidden">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Placeholder pattern */
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%)] bg-[length:20px_20px]" />
            </div>
          )}

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl">
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-green fill-primary-green ml-1" />
            </button>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>

          {/* Category badge */}
          <div
            className={cn(
              "absolute top-2 left-2 sm:top-3 sm:left-3 text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full capitalize",
              categoryColors[category] || "bg-primary-green text-white"
            )}
          >
            {category.replace("-", " ")}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary-green/0 group-hover:bg-primary-green/10 transition-colors duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary-green transition-colors">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const { videos, articles, loading } = useContent();

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col">
      <BackgroundCircles variant="dense" />
      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-br from-primary-peach/10 via-background to-primary-green/10 overflow-hidden flex-1">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary-green/20 rounded-full blur-3xl"
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
            className="absolute bottom-0 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary-orange/20 rounded-full blur-3xl"
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
          <div className="absolute top-1/2 right-10 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-primary-peach/15 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-10 w-20 sm:w-30 md:w-40 h-20 sm:h-30 md:h-40 bg-primary-green/15 rounded-full blur-2xl" />
        </div>

        <div className="relative container mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-primary-orange/20 to-primary-orange/10 text-primary-orange rounded-full text-xs sm:text-sm font-medium border border-primary-orange/20 shadow-sm">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Learning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-foreground">Resources, Videos </span>
              <span className="bg-gradient-to-r from-primary-green to-primary-peach bg-clip-text text-transparent">
                & Guides
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-4">
              A central place to watch lessons, download files and read
              write-ups. Everything you need to build disciplined investing
              skills.
            </p>
          </motion.div>

          {/* Hero CTA Buttons
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-10 md:mb-12"
          >
            <Button
              onClick={() => setActiveTab("videos")}
              className="bg-primary-green hover:bg-primary-green/90 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Videos
            </Button>
            <Button
              onClick={() => setActiveTab("downloads")}
              variant="outline"
              className="border-2 border-primary-green/20 hover:bg-primary-green/5 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
            >
              <Download className="w-4 h-4 mr-2" />
              Downloads
            </Button>
          </motion.div> */}

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-primary-green to-primary-green/80 text-white shadow-lg shadow-primary-green/20"
                    : "bg-white text-muted-foreground hover:text-foreground border border-border/50"
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Videos Tab */}
            {activeTab === "videos" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                  </div>
                ) : videos.length !== 0 ? (
                  videos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      description={video.description}
                      duration={video.duration}
                      thumbnailUrl={video.thumbnailUrl}
                      category={video.category}
                      index={index}
                    />
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    No videos available yet. Check back soon!
                  </div>
                )}
              </div>
            )}

            {/* Downloads Tab */}
            {activeTab === "downloads" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {downloads.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-xl p-4 sm:p-5 shadow-lg border border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-green/20 to-primary-green/10 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                        {file.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground text-sm sm:text-base truncate group-hover:text-primary-green transition-colors">
                          {file.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {file.type} • {file.size}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary-green hover:bg-primary-green/90 text-white w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Articles Tab */}
            {activeTab === "articles" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {loading ? (
                  <div className="col-span-full flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                  </div>
                ) : articles.length !== 0 ? (
                  articles.map((article, index) => (
                    <Link
                      key={article.id}
                      href={`/learn/articles/${article.slug}`}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                      >
                        {/* Article Header */}
                        <div className="h-24 sm:h-32 bg-gradient-to-br from-primary-green/10 via-primary-orange/5 to-primary-peach/10 relative overflow-hidden">
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-primary-green/30" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "absolute top-2 left-2 sm:top-3 sm:left-3 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full capitalize",
                              categoryColors[article.category] ||
                                "bg-primary-green text-white"
                            )}
                          >
                            {article.category.replace("-", " ")}
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3">
                          <h3 className="font-bold text-foreground text-base sm:text-lg group-hover:text-primary-green transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {new Date(article.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              {article.readTime}
                            </span>
                          </div>
                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1 text-primary-green text-xs sm:text-sm font-semibold group-hover:gap-2 transition-all">
                              Read More
                              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-500 col-span-full text-center py-8">
                    No articles available yet. Check back soon!
                  </div>
                )}
              </div>
            )}

            {/* Tips Tab */}
            {activeTab === "tips" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-gradient-to-br from-white to-primary-green/5 rounded-xl p-4 sm:p-5 shadow-lg border border-primary-green/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-green/20 transition-colors">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-green" />
                      </div>
                      <p className="text-sm sm:text-base text-foreground leading-relaxed">
                        <strong className="text-primary-green">Tip:</strong>{" "}
                        {tip}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8 sm:mt-10 md:mt-12"
          >
            <button className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-transparent border-2 border-primary-green text-primary-green text-sm sm:text-base font-semibold rounded-full hover:bg-primary-green hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-green/25">
              View All Resources
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 sm:mt-10 md:mt-12 text-center text-muted-foreground text-sm sm:text-base"
          >
            <p>
              More resources coming soon! Have suggestions?{" "}
              <span className="text-primary-green font-semibold cursor-pointer hover:underline">
                Let us know
              </span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* <PageFooter /> */}
    </div>
  );
}
