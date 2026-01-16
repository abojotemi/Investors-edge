"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  Search,
  Filter,
  TrendingUp,
  ChevronRight,
  MessageCircle,
  User,
  Pin,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";

const categories = [
  { id: "all", label: "All Topics" },
  { id: "beginner", label: "Beginner Questions" },
  { id: "stocks", label: "Stock Investing" },
  { id: "real-estate", label: "Real Estate" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "retirement", label: "Retirement Planning" },
  { id: "strategies", label: "Investment Strategies" },
];

interface Discussion {
  id: string;
  title: string;
  preview: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  replies: number;
  views: number;
  lastActivity: string;
  pinned?: boolean;
  hot?: boolean;
  avatar?: string;
}

const discussions: Discussion[] = [];

export default function ForumPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDiscussions = discussions.filter((disc) => {
    const categoryMatch =
      selectedCategory === "all" || disc.category === selectedCategory;
    const searchMatch =
      disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disc.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const pinnedDiscussions = filteredDiscussions.filter((d) => d.pinned);
  const regularDiscussions = filteredDiscussions.filter((d) => !d.pinned);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discussion <span className="text-primary-green">Forum</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ask questions, share insights, and learn from fellow investors in
            our community.
          </p>
        </motion.div>

        {/* Search and New Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all"
            />
          </div>
          <Button className="bg-primary-green hover:bg-primary-green/90 text-white px-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Filter by topic
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

        {/* Pinned Discussions */}
        {pinnedDiscussions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-primary-orange" />
              <span className="text-sm font-medium text-gray-600">Pinned</span>
            </div>
            <div className="space-y-4">
              {pinnedDiscussions.map((discussion) => (
                <DiscussionCard key={discussion.id} discussion={discussion} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Discussions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Recent Discussions
            </span>
          </div>
          <div className="space-y-4">
            {regularDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index, duration: 0.4 }}
              >
                <DiscussionCard discussion={discussion} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredDiscussions.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No discussions found
            </h3>
            <p className="text-gray-500">
              Try a different search term or category.
            </p>
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-8">
          <Button
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Load More Discussions
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DiscussionCard({
  discussion,
}: {
  discussion: (typeof discussions)[0];
}) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-700",
      stocks: "bg-blue-100 text-blue-700",
      "real-estate": "bg-purple-100 text-purple-700",
      crypto: "bg-orange-100 text-orange-700",
      retirement: "bg-pink-100 text-pink-700",
      strategies: "bg-indigo-100 text-indigo-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-green/30 hover:shadow-md transition-all cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex w-12 h-12 bg-primary-green/10 rounded-full items-center justify-center flex-shrink-0">
          <span className="text-primary-green font-semibold">
            {discussion.avatar}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                discussion.category
              )}`}
            >
              {categories.find((c) => c.id === discussion.category)?.label}
            </span>
            {discussion.hot && (
              <span className="flex items-center gap-1 text-xs font-medium text-primary-peach bg-primary-peach/10 px-2 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                Hot
              </span>
            )}
            {discussion.pinned && (
              <Pin className="w-3 h-3 text-primary-orange" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
            {discussion.title}
          </h3>
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {discussion.preview}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {discussion.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {discussion.lastActivity}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
