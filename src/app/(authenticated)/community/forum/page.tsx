"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Eye,
  Clock,
  Search,
  Filter,
  ChevronRight,
  MessageCircle,
  User,
  Pin,
  Flame,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useAuth } from "@/context/auth-context";
import { addDiscussion, getDiscussions } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import type { Discussion, DiscussionCategory } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const categories = [
  { id: "all", label: "All Topics" },
  { id: "beginner", label: "Beginner Questions" },
  { id: "stocks", label: "Stock Investing" },
  { id: "real-estate", label: "Real Estate" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "retirement", label: "Retirement Planning" },
  { id: "strategies", label: "Investment Strategies" },
];

const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function ForumPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "beginner" as DiscussionCategory,
  });

  // Real-time listener for discussions
  useEffect(() => {
    const discussionsQuery = query(
      collection(db, "discussions"),
      orderBy("lastActivityAt", "desc")
    );

    const unsubscribe = onSnapshot(
      discussionsQuery,
      (snapshot) => {
        const fetchedDiscussions: Discussion[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            content: data.content || "",
            category: data.category as DiscussionCategory,
            author: data.author,
            replies: (data.replies || []).map(
              (reply: Record<string, unknown>) => ({
                ...reply,
                createdAt: convertTimestamp(reply.createdAt as Timestamp),
              })
            ),
            replyCount: data.replyCount || 0,
            viewCount: data.viewCount || 0,
            pinned: data.pinned || false,
            hot: data.hot || false,
            status: data.status || "open",
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
            lastActivityAt: convertTimestamp(data.lastActivityAt),
          } as Discussion;
        });
        setDiscussions(fetchedDiscussions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching discussions:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleCreateDiscussion = async () => {
    if (!user) {
      toast.error("Please sign in to create a discussion");
      return;
    }

    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await addDiscussion({
        title: newDiscussion.title,
        content: newDiscussion.content,
        category: newDiscussion.category,
        author: {
          userId: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || "",
          avatar: user.displayName?.charAt(0).toUpperCase() || "A",
        },
        status: "open",
      });
      toast.success("Discussion created successfully!");
      setShowNewDialog(false);
      setNewDiscussion({ title: "", content: "", category: "beginner" });
    } catch (error) {
      console.error("Error creating discussion:", error);
      toast.error("Failed to create discussion");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDiscussions = discussions.filter((disc) => {
    const categoryMatch =
      selectedCategory === "all" || disc.category === selectedCategory;
    const searchMatch =
      disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disc.content.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const pinnedDiscussions = filteredDiscussions.filter((d) => d.pinned);
  const regularDiscussions = filteredDiscussions.filter((d) => !d.pinned);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

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
          <Button
            onClick={() => setShowNewDialog(true)}
            className="bg-primary-green hover:bg-primary-green/90 text-white px-6"
          >
            <Plus className="w-4 h-4 mr-2" />
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
                <DiscussionCard
                  key={discussion.id}
                  discussion={discussion}
                  formatTimeAgo={formatTimeAgo}
                />
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
                <DiscussionCard
                  discussion={discussion}
                  formatTimeAgo={formatTimeAgo}
                />
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
            <p className="text-gray-500 mb-4">
              {discussions.length === 0
                ? "Be the first to start a discussion!"
                : "Try a different search term or category."}
            </p>
            {discussions.length === 0 && (
              <Button
                onClick={() => setShowNewDialog(true)}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start a Discussion
              </Button>
            )}
          </div>
        )}
      </div>

      {/* New Discussion Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start a New Discussion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What do you want to discuss?"
                value={newDiscussion.title}
                onChange={(e) =>
                  setNewDiscussion({ ...newDiscussion, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newDiscussion.category}
                onValueChange={(value) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    category: value as DiscussionCategory,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, questions, or insights..."
                rows={5}
                value={newDiscussion.content}
                onChange={(e) =>
                  setNewDiscussion({
                    ...newDiscussion,
                    content: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateDiscussion}
              disabled={submitting}
              className="bg-primary-green hover:bg-primary-green/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Discussion
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DiscussionCard({
  discussion,
  formatTimeAgo,
}: {
  discussion: Discussion;
  formatTimeAgo: (date: Date) => string;
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
    <Link href={`/community/forum/${discussion.id}`}>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-green/30 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 bg-primary-green/10 rounded-full items-center justify-center flex-shrink-0">
            <span className="text-primary-green font-semibold">
              {discussion.author?.avatar ||
                discussion.author?.name?.charAt(0) ||
                "?"}
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
              {discussion.status === "resolved" && (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Resolved
                </span>
              )}
              {discussion.status === "closed" && (
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Closed
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
              {discussion.title}
            </h3>
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {discussion.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {discussion.author?.name || "Anonymous"}
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                {discussion.replyCount} replies
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {discussion.viewCount} views
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTimeAgo(discussion.lastActivityAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
