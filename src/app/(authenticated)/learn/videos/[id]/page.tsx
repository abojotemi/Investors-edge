"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  User,
  Play,
  Loader2,
  Share2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { getVideo } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";
import type { Video } from "@/types/admin";

const categoryColors: Record<string, string> = {
  beginner: "bg-primary-green text-white",
  intermediate: "bg-primary-orange text-white",
  advanced: "bg-red-500 text-white",
  "market-analysis": "bg-blue-500 text-white",
  tutorials: "bg-purple-500 text-white",
  webinars: "bg-indigo-500 text-white",
};

// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string | null => {
  // Handle various YouTube URL formats
  const patterns = [
    // Standard watch URL: youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
    // Short URL: youtu.be/VIDEO_ID
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // Embed URL: youtube.com/embed/VIDEO_ID
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    // YouTube Shorts: youtube.com/shorts/VIDEO_ID
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  return null;
};

// Helper function to convert Vimeo URLs to embed format
const getVimeoEmbedUrl = (url: string): string | null => {
  const patterns = [
    // Standard Vimeo URL: vimeo.com/VIDEO_ID
    /vimeo\.com\/(\d+)/,
    // Player URL: player.vimeo.com/video/VIDEO_ID
    /player\.vimeo\.com\/video\/(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://player.vimeo.com/video/${match[1]}`;
    }
  }

  return null;
};

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;
  const { videos, loading: contentLoading } = useContent();

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadVideo = async () => {
      // First try to get from context (faster if already loaded)
      const videoFromContext = videos.find((v) => v.id === videoId);
      if (videoFromContext) {
        setVideo(videoFromContext);
        setLoading(false);
        return;
      }

      // If content is still loading, wait
      if (contentLoading) {
        return;
      }

      // If content is loaded but video not found, fetch directly from Firebase
      try {
        const videoFromFirebase = await getVideo(videoId);
        if (videoFromFirebase && videoFromFirebase.status === "published") {
          setVideo(videoFromFirebase);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
  }, [videoId, videos, contentLoading]);

  // Get related videos (same category, excluding current)
  const relatedVideos = videos
    .filter((v) => v.id !== videoId && v.category === video?.category)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Video Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The video you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.push("/learn")}
            className="bg-primary-green hover:bg-primary-green/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col">
      <BackgroundCircles variant="dense" />

      <section className="relative py-6 sm:py-8 md:py-12 px-4 bg-gradient-to-br from-primary-peach/10 via-background to-primary-green/10 flex-1">
        <div className="relative container mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Learning Hub</span>
            </Link>
          </motion.div>

          {/* Video Player Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-8"
          >
            {video.videoUrl ? (
              <div className="aspect-video">
                {(() => {
                  const youtubeEmbedUrl = getYouTubeEmbedUrl(video.videoUrl);
                  const vimeoEmbedUrl = getVimeoEmbedUrl(video.videoUrl);

                  if (youtubeEmbedUrl) {
                    return (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }

                  if (vimeoEmbedUrl) {
                    return (
                      <iframe
                        src={vimeoEmbedUrl}
                        title={video.title}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }

                  // Default: treat as direct video URL
                  return (
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full"
                      poster={video.thumbnailUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                })()}
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary-green/20 via-primary-orange/10 to-primary-peach/20 flex items-center justify-center">
                <div className="text-center text-white/70">
                  <Play className="w-16 h-16 mx-auto mb-2" />
                  <p>Video not available</p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Title and Meta */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full capitalize",
                      categoryColors[video.category] ||
                        "bg-primary-green text-white"
                    )}
                  >
                    {video.category.replace("-", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {video.duration}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {video.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {video.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(video.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="prose prose-gray max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Tags */}
                {video.tags.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-border/50 flex gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar - Related Videos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {relatedVideos.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-green" />
                    Related Videos
                  </h3>
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <Link
                        key={relatedVideo.id}
                        href={`/learn/videos/${relatedVideo.id}`}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          <div className="w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-green/20 to-primary-orange/10 relative">
                            {relatedVideo.thumbnailUrl ? (
                              <img
                                src={relatedVideo.thumbnailUrl}
                                alt={relatedVideo.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Play className="w-6 h-6 text-primary-green/50" />
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary-green transition-colors">
                              {relatedVideo.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedVideo.duration}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Learning Hub Card */}
              <div className="bg-gradient-to-br from-primary-green/10 to-primary-orange/10 rounded-2xl p-6 border border-primary-green/20">
                <h3 className="font-bold text-lg mb-2">Explore More Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover more videos, articles, and resources in our Learning
                  Hub.
                </p>
                <Button
                  onClick={() => router.push("/learn")}
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learning Hub
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
