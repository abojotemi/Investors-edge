"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  MessageCircle,
  User,
  Pin,
  Plus,
  Loader2,
  CheckCircle2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useAuth } from "@/context/auth-context";
import { addDiscussion } from "@/lib/firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import type { Discussion, DiscussionCategory } from "@/types/admin";
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

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionText, setQuestionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmitQuestion = async () => {
    if (!user) {
      toast.error("Please sign in to ask a question");
      return;
    }

    if (!questionText.trim()) {
      toast.error("Please type your question");
      return;
    }

    setSubmitting(true);
    try {
      await addDiscussion({
        title: questionText.trim(),
        content: questionText.trim(),
        category: "beginner" as DiscussionCategory,
        author: {
          userId: user.uid,
          name: user.displayName || "Anonymous",
          email: user.email || "",
          avatar: user.displayName?.charAt(0).toUpperCase() || "A",
        },
        status: "open",
      });
      toast.success("Your question has been submitted!");
      setQuestionText("");
    } catch (error) {
      console.error("Error submitting question:", error);
      toast.error("Failed to submit question");
    } finally {
      setSubmitting(false);
    }
  };

  const pinnedDiscussions = discussions.filter((d) => d.pinned);
  const regularDiscussions = discussions.filter((d) => !d.pinned);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 pt-24 pb-16 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Anything bothering you about{" "}
            <span className="text-primary-green">investing</span>?
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Ask <span className="text-primary-green">Your Question</span>
          </p>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <Image
              src="/forum-hero.png"
              alt="People discussing investing"
              width={340}
              height={260}
              className="w-auto h-auto max-h-[240px]"
              priority
            />
          </motion.div>

          {/* Question Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <div className="relative flex-1">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ask your question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !submitting) handleSubmitQuestion();
                }}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-primary-green outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
            <Button
              onClick={handleSubmitQuestion}
              disabled={submitting || !questionText.trim()}
              className="bg-primary-green hover:bg-primary-green/90 text-white px-6 py-3.5 h-auto rounded-xl font-semibold text-base whitespace-nowrap disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Question
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Divider */}
        {discussions.length > 0 && (
          <div className="border-t border-gray-200 my-8" />
        )}

        {/* Pinned Questions */}
        {pinnedDiscussions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Pin className="w-4 h-4 text-primary-orange" />
              <span className="text-sm font-semibold text-gray-600">
                Pinned
              </span>
            </div>
            <div className="space-y-3">
              {pinnedDiscussions.map((discussion) => (
                <QuestionCard
                  key={discussion.id}
                  discussion={discussion}
                  formatTimeAgo={formatTimeAgo}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* All Questions */}
        {regularDiscussions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-semibold text-gray-600">
                Recent Questions
              </span>
            </div>
            <div className="space-y-3">
              {regularDiscussions.map((discussion, index) => (
                <motion.div
                  key={discussion.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                >
                  <QuestionCard
                    discussion={discussion}
                    formatTimeAgo={formatTimeAgo}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {discussions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-12"
          >
            <MessageSquare className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No questions yet
            </h3>
            <p className="text-gray-500">
              Be the first to ask a question above!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Question Card ---
function QuestionCard({
  discussion,
  formatTimeAgo,
}: {
  discussion: Discussion;
  formatTimeAgo: (date: Date) => string;
}) {
  const hasAdminReply = discussion.replies?.some(
    (r) => r.author?.isAdmin
  );

  return (
    <Link href={`/community/forum/${discussion.id}`}>
      <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-primary-green/30 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="hidden sm:flex w-10 h-10 bg-primary-green/10 rounded-full items-center justify-center flex-shrink-0">
            <span className="text-primary-green font-semibold text-sm">
              {discussion.author?.avatar ||
                discussion.author?.name?.charAt(0) ||
                "?"}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-primary-green transition-colors line-clamp-2">
              {discussion.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {discussion.author?.name || "Anonymous"}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatTimeAgo(discussion.lastActivityAt)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {discussion.replyCount}{" "}
                {discussion.replyCount === 1 ? "reply" : "replies"}
              </span>
            </div>

            {/* Admin answered badge */}
            {hasAdminReply && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Answered
              </div>
            )}

            {/* Status badges */}
            {discussion.status === "resolved" && !hasAdminReply && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Resolved
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
