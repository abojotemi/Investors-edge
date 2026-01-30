"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Filter,
  Pin,
  Flame,
  Eye,
  MessageCircle,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  getDiscussions,
  updateDiscussion,
  deleteDiscussion,
} from "@/lib/firebase/firestore";
import type { Discussion, DiscussionStatus } from "@/types/admin";
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

const statusOptions = [
  { id: "all", label: "All Status" },
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "closed", label: "Closed" },
];

const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function AdminDiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [discussionToDelete, setDiscussionToDelete] = useState<string | null>(
    null
  );

  // Real-time listener
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

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await updateDiscussion(id, { pinned: !currentPinned });
      toast.success(currentPinned ? "Discussion unpinned" : "Discussion pinned");
    } catch (error) {
      toast.error("Failed to update discussion");
    }
  };

  const handleChangeStatus = async (id: string, status: DiscussionStatus) => {
    try {
      await updateDiscussion(id, { status });
      toast.success(`Discussion marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!discussionToDelete) return;
    try {
      await deleteDiscussion(discussionToDelete);
      toast.success("Discussion deleted");
      setDeleteDialogOpen(false);
      setDiscussionToDelete(null);
    } catch (error) {
      toast.error("Failed to delete discussion");
    }
  };

  const filteredDiscussions = discussions.filter((disc) => {
    const categoryMatch =
      categoryFilter === "all" || disc.category === categoryFilter;
    const statusMatch =
      statusFilter === "all" || disc.status === statusFilter;
    const searchMatch =
      disc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      disc.author?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

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

  // Stats
  const openCount = discussions.filter((d) => d.status === "open").length;
  const resolvedCount = discussions.filter(
    (d) => d.status === "resolved"
  ).length;
  const closedCount = discussions.filter((d) => d.status === "closed").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading discussions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Forum Discussions
          </h1>
          <p className="text-gray-600 mt-2">
            View and respond to community discussions
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{discussions.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Open</p>
                <p className="text-2xl font-bold">{openCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary-green" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Closed</p>
                <p className="text-2xl font-bold">{closedCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Discussions List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredDiscussions.length > 0 ? (
            filteredDiscussions.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center flex-shrink-0">
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
                        {
                          categories.find((c) => c.id === discussion.category)
                            ?.label
                        }
                      </span>
                      {discussion.pinned && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary-orange bg-primary-orange/10 px-2 py-1 rounded-full">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      {discussion.hot && (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary-peach bg-primary-peach/10 px-2 py-1 rounded-full">
                          <Flame className="w-3 h-3" />
                          Hot
                        </span>
                      )}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          discussion.status === "open"
                            ? "bg-blue-100 text-blue-700"
                            : discussion.status === "resolved"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {discussion.status.charAt(0).toUpperCase() +
                          discussion.status.slice(1)}
                      </span>
                    </div>
                    <Link href={`/admin/discussions/${discussion.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-green transition-colors mb-2">
                        {discussion.title}
                      </h3>
                    </Link>
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
                  <div className="flex flex-col gap-2">
                    <Link href={`/admin/discussions/${discussion.id}`}>
                      <Button size="sm" className="bg-primary-green hover:bg-primary-green/90 w-full">
                        View & Reply
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleTogglePin(discussion.id, discussion.pinned)
                      }
                    >
                      <Pin className="w-4 h-4 mr-1" />
                      {discussion.pinned ? "Unpin" : "Pin"}
                    </Button>
                    <Select
                      value={discussion.status}
                      onValueChange={(value) =>
                        handleChangeStatus(
                          discussion.id,
                          value as DiscussionStatus
                        )
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setDiscussionToDelete(discussion.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No discussions found
              </h3>
              <p className="text-gray-500">
                {discussions.length === 0
                  ? "No discussions have been created yet."
                  : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discussion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this discussion and all its replies.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
