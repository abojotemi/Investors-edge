"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  CalendarDays,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getWeeklyRecaps,
  deleteWeeklyRecap,
} from "@/lib/firebase/firestore";
import type { WeeklyRecap } from "@/types/admin";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";

const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function AdminRecapsPage() {
  const [recaps, setRecaps] = useState<WeeklyRecap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recapToDelete, setRecapToDelete] = useState<string | null>(null);

  // Real-time listener
  useEffect(() => {
    const recapsQuery = query(
      collection(db, "weeklyRecaps"),
      orderBy("weekStartDate", "desc")
    );

    const unsubscribe = onSnapshot(
      recapsQuery,
      (snapshot) => {
        const fetchedRecaps: WeeklyRecap[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            weekStartDate: convertTimestamp(data.weekStartDate),
            weekEndDate: convertTimestamp(data.weekEndDate),
            content: data.content || "",
            highlights: data.highlights || [],
            status: data.status || "draft",
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          } as WeeklyRecap;
        });
        setRecaps(fetchedRecaps);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching recaps:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (!recapToDelete) return;
    try {
      await deleteWeeklyRecap(recapToDelete);
      toast.success("Weekly recap deleted");
      setDeleteDialogOpen(false);
      setRecapToDelete(null);
    } catch (error) {
      toast.error("Failed to delete weekly recap");
    }
  };

  const filteredRecaps = recaps.filter((recap) =>
    recap.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateRange = (start: Date, end: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const startStr = start.toLocaleDateString("en-US", options);
    const endStr = end.toLocaleDateString("en-US", { ...options, year: "numeric" });
    return `${startStr} - ${endStr}`;
  };

  // Stats
  const publishedCount = recaps.filter((r) => r.status === "published").length;
  const draftCount = recaps.filter((r) => r.status === "draft").length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading weekly recaps...</p>
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
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weekly Recaps</h1>
            <p className="text-gray-600 mt-1">
              Create and manage weekly market highlights
            </p>
          </div>
          <Link href="/admin/recaps/new">
            <Button className="bg-primary-green hover:bg-primary-green/90">
              <Plus className="w-4 h-4 mr-2" />
              New Weekly Recap
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Recaps</p>
                <p className="text-2xl font-bold">{recaps.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Published</p>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold">{draftCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search recaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Recaps List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {filteredRecaps.length > 0 ? (
            filteredRecaps.map((recap, index) => (
              <motion.div
                key={recap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-green/20 to-primary-green/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-7 h-7 text-primary-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          recap.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {recap.status.charAt(0).toUpperCase() +
                          recap.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateRange(recap.weekStartDate, recap.weekEndDate)}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {recap.title}
                    </h3>
                    {recap.highlights.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {recap.highlights.length} highlight
                        {recap.highlights.length !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/recaps/${recap.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => {
                        setRecapToDelete(recap.id);
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
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No weekly recaps yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first weekly recap to share market highlights with
                your community.
              </p>
              <Link href="/admin/recaps/new">
                <Button className="bg-primary-green hover:bg-primary-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Weekly Recap
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Weekly Recap?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this weekly recap. This action cannot
              be undone.
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
