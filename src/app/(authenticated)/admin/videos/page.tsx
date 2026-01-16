"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Video,
  Clock,
  CheckSquare,
  Square,
  Archive,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ContentStatus } from "@/types/admin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const statusFilters: { label: string; value: ContentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

export default function VideosPage() {
  const { videos, deleteVideo, bulkUpdateStatus, bulkDelete } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">(
    "all"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredVideos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVideos.map((v) => v.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVideo(id);
      setShowDeleteConfirm(null);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.success("Video deleted", {
        description: "The video has been permanently removed.",
      });
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Error deleting video", {
        description:
          "There was a problem deleting the video. Please try again.",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await bulkDelete("video", selectedIds);
      toast.success(`${selectedIds.length} videos deleted`, {
        description: "The selected videos have been removed.",
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk deleting videos:", error);
      toast.error("Error deleting videos", {
        description:
          "There was a problem deleting the videos. Please try again.",
      });
    }
  };

  const handleBulkStatusChange = async (status: ContentStatus) => {
    try {
      await bulkUpdateStatus("video", selectedIds, status);
      toast.success(`Status updated`, {
        description: `${selectedIds.length} videos marked as ${status}.`,
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Error updating video status:", error);
      toast.error("Error updating status", {
        description:
          "There was a problem updating the status. Please try again.",
      });
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    const styles = {
      published: "bg-green-100 text-green-700",
      draft: "bg-yellow-100 text-yellow-700",
      archived: "bg-gray-100 text-gray-700",
    };
    return styles[status];
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-1">
            Manage your video content library
          </p>
        </div>
        <Link href="/admin/videos/new">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Video
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-1">
              {statusFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === filter.value
                      ? "bg-primary-green text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedIds.length} selected
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange("published")}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange("draft")}
                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Unpublish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusChange("archived")}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                <Archive className="w-4 h-4 mr-1" />
                Archive
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Videos Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {filteredVideos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={handleSelectAll}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {selectedIds.length === filteredVideos.length ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Video
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVideos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleSelect(video.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {selectedIds.includes(video.id) ? (
                          <CheckSquare className="w-5 h-5 text-primary-green" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Video className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/videos/${video.id}`}
                            className="font-medium text-gray-900 hover:text-primary-green truncate block"
                          >
                            {video.title}
                          </Link>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {video.category.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                          video.status
                        )}`}
                      >
                        {video.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {video.duration}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDate(video.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === video.id ? null : video.id
                            )
                          }
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {openDropdown === video.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdown(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                              <Link
                                href={`/admin/videos/${video.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                              <Link
                                href={`/learn/videos/${video.id}`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Link>
                              <button
                                onClick={() => {
                                  setShowDeleteConfirm(video.id);
                                  setOpenDropdown(null);
                                }}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first video"}
            </p>
            <Link href="/admin/videos/new">
              <Button className="bg-primary-green hover:bg-primary-green/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </Link>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Video
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this video? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
