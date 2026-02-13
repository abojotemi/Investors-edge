"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Play,
  Clock,
  Search,
  Filter,
  Loader2,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Presentation,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { cn } from "@/lib/utils";
import type { VideoCategory } from "@/types/admin";

const categoryConfig: Record<
  VideoCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  beginner: {
    label: "Beginner",
    icon: <GraduationCap className="w-4 h-4" />,
    color: "bg-primary-green text-white",
  },
  intermediate: {
    label: "Intermediate",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-primary-orange text-white",
  },
  advanced: {
    label: "Advanced",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "bg-red-500 text-white",
  },
  "market-analysis": {
    label: "Market Analysis",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "bg-blue-500 text-white",
  },
  tutorials: {
    label: "Tutorials",
    icon: <Video className="w-4 h-4" />,
    color: "bg-purple-500 text-white",
  },
  webinars: {
    label: "Webinars",
    icon: <Presentation className="w-4 h-4" />,
    color: "bg-indigo-500 text-white",
  },
};

export default function VideosPage() {
  const { videos, loading } = useContent();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    VideoCategory | "all"
  >("all");

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || video.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [videos, searchQuery, selectedCategory]);

  const categories = Object.keys(categoryConfig) as VideoCategory[];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
      <BackgroundCircles variant="dense" />

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-br from-primary-peach/10 via-background to-primary-green/10">
        <div className="relative container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-green/10 text-primary-green text-sm font-medium mb-6">
              <Play className="w-4 h-4" />
              Video Tutorials
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learn with{" "}
              <span className="text-primary-green">Video Tutorials</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Watch expert-led video tutorials covering everything from
              investment basics to advanced strategies.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="pl-10 h-12 bg-white border-border/50"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={cn(
                    "flex-shrink-0",
                    selectedCategory === "all" &&
                      "bg-primary-green hover:bg-primary-green/90"
                  )}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "flex-shrink-0",
                      selectedCategory === category &&
                        "bg-primary-green hover:bg-primary-green/90"
                    )}
                  >
                    {categoryConfig[category].label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Video Grid */}
          {filteredVideos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No videos found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Check back soon for new video content!"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link href={`/learn/videos/${video.id}`} className="group">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl hover:border-primary-green/30 transition-all duration-300">
                      {/* Thumbnail */}
                      <div className="aspect-video relative bg-gradient-to-br from-primary-green/20 to-primary-orange/10 overflow-hidden">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Play className="w-12 h-12 text-primary-green/50" />
                          </div>
                        )}
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>
                        {/* Duration Badge */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded-lg flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </div>
                        {/* Category Badge */}
                        <div
                          className={cn(
                            "absolute top-3 left-3 px-3 py-1 text-xs font-medium rounded-full",
                            categoryConfig[video.category]?.color ||
                              "bg-primary-green text-white"
                          )}
                        >
                          {categoryConfig[video.category]?.label ||
                            video.category}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {video.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{video.author}</span>
                          <span>
                            {new Date(video.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center text-sm text-muted-foreground"
          >
            Showing {filteredVideos.length} of {videos.length} videos
          </motion.div>
        </div>
      </section>
    </div>
  );
}
