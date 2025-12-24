"use client";

import React from "react";
import { Play, Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { videos } from "@/lib/constants/home";

interface VideoCardProps {
  title: string;
  description: string;
  duration: string;
  views: string;
  thumbnail?: string;
  category: string;
  index: number;
}

const VideoCard = ({
  title,
  description,
  duration,
  views,
  category,
  index,
}: VideoCardProps) => {
  const categoryColors: Record<string, string> = {
    "Getting Started": "bg-primary-green text-white",
    "Savings & Budgeting": "bg-primary-orange text-white",
    "Investment Types": "bg-primary-peach text-white",
  };

  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-lg border border-border/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
        "animate-in fade-in slide-in-from-bottom-4"
      )}
      style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
    >
      {/* Video Thumbnail / Placeholder */}
      <div className="relative aspect-video bg-gradient-to-br from-primary-green/20 via-primary-orange/10 to-primary-peach/20 overflow-hidden">
        {/* Placeholder pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.05)_25%,rgba(0,0,0,0.05)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.05)_75%)] bg-[length:20px_20px]" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:shadow-2xl">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary-green fill-primary-green ml-1" />
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {duration}
        </div>

        {/* Category badge */}
        <div
          className={cn(
            "absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full",
            categoryColors[category] || "bg-primary-green text-white"
          )}
        >
          {category}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary-green/0 group-hover:bg-primary-green/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary-green transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{views} views</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoSection = () => {
  return (
    <section className="relative py-16 lg:py-24 bg-gradient-to-br from-primary-peach/10 via-background to-primary-green/10">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-green/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary-orange/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-primary-peach/15 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-primary-green/15 rounded-full blur-2xl" />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-orange/20 to-primary-orange/10 text-primary-orange rounded-full text-sm font-medium border border-primary-orange/20 shadow-sm">
            <Play className="w-4 h-4" />
            <span>Learn to Invest</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-foreground">Master Money </span>
            <span className="bg-gradient-to-r from-primary-green to-primary-peach bg-clip-text text-transparent">
              While in School
            </span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Watch bite-sized tutorials on savings, investing basics, and
            building wealth as a student. Learn at your own pace.
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video, index) => (
            <VideoCard key={video.title} {...video} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-primary-green text-primary-green font-semibold rounded-full hover:bg-primary-green hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-green/25">
            View All Tutorials
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
