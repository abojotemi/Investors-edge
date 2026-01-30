"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Eye,
  Clock,
  User,
  Pin,
  Flame,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import BackgroundCircles from "@/components/ui/background-circles";
import { useAuth } from "@/context/auth-context";
import { getDiscussion, addReply } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import type { Discussion, Reply } from "@/types/admin";
import {
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const categories = [
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

export default function DiscussionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const discussionId = params.id as string;

  // Real-time listener for this discussion
  useEffect(() => {
    if (!discussionId) return;

    const docRef = doc(db, "discussions", discussionId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setDiscussion(null);
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        setDiscussion({
          id: docSnap.id,
          title: data.title || "",
          content: data.content || "",
          category: data.category,
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
        } as Discussion);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching discussion:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [discussionId]);

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error("Please sign in to reply");
      return;
    }

    if (!replyContent.trim()) {
      toast.error("Please enter a reply");
      return;
    }

    if (discussion?.status === "closed") {
      toast.error("This discussion is closed");
      return;
    }

    setSubmitting(true);
    try {
      await addReply(discussionId, {
        content: replyContent,
        author: {
          userId: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || "",
          avatar: user.displayName?.charAt(0).toUpperCase() || "A",
        },
      });
      toast.success("Reply posted!");
      setReplyContent("");
    } catch (error) {
      console.error("Error posting reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading discussion...</p>
        </div>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Discussion Not Found
          </h2>
          <p className="text-gray-500 mb-4">
            This discussion may have been deleted or doesn&apos;t exist.
          </p>
          <Link href="/community/forum">
            <Button className="bg-primary-green hover:bg-primary-green/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Forum
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href="/community/forum"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>
        </motion.div>

        {/* Main Discussion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
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
              <span className="flex items-center gap-1 text-xs font-medium text-primary-orange bg-primary-orange/10 px-2 py-1 rounded-full">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
            {discussion.status === "resolved" && (
              <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                Resolved
              </span>
            )}
            {discussion.status === "closed" && (
              <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                <XCircle className="w-3 h-3" />
                Closed
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {discussion.title}
          </h1>

          {/* Author Info */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center">
              <span className="text-primary-green font-semibold text-lg">
                {discussion.author?.avatar ||
                  discussion.author?.name?.charAt(0) ||
                  "?"}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {discussion.author?.name || "Anonymous"}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(discussion.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {discussion.viewCount} views
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">
              {discussion.content}
            </p>
          </div>
        </motion.div>

        {/* Replies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              {discussion.replyCount} Replies
            </h2>
          </div>

          {discussion.replies.length > 0 ? (
            <div className="space-y-4">
              {discussion.replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                  className={`bg-white rounded-xl p-6 shadow-sm border ${
                    reply.author?.isAdmin
                      ? "border-primary-green/30 bg-primary-green/5"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        reply.author?.isAdmin
                          ? "bg-primary-green/20"
                          : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`font-semibold ${
                          reply.author?.isAdmin
                            ? "text-primary-green"
                            : "text-gray-600"
                        }`}
                      >
                        {reply.author?.avatar ||
                          reply.author?.name?.charAt(0) ||
                          "?"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900">
                          {reply.author?.name || "Anonymous"}
                        </span>
                        {reply.author?.isAdmin && (
                          <span className="text-xs font-medium text-primary-green bg-primary-green/10 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatTimeAgo(reply.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No replies yet. Be the first to respond!
              </p>
            </div>
          )}
        </motion.div>

        {/* Reply Form */}
        {discussion.status !== "closed" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add a Reply
            </h3>
            <Textarea
              placeholder="Share your thoughts..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitReply}
                disabled={submitting || !replyContent.trim()}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="bg-gray-100 rounded-xl p-6 text-center">
            <XCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              This discussion is closed and no longer accepting replies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
