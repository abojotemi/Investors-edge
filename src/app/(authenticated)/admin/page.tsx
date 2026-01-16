"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Video,
  FileText,
  Eye,
  Edit,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function AdminDashboard() {
  const { stats, videos, articles } = useAdmin();

  const recentVideos = videos.slice(0, 3);
  const recentArticles = articles.slice(0, 3);

  const statCards = [
    {
      label: "Total Videos",
      value: stats.totalVideos,
      icon: Video,
      color: "bg-blue-500",
      href: "/admin/videos",
    },
    {
      label: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "bg-purple-500",
      href: "/admin/articles",
    },
    {
      label: "Published",
      value: stats.publishedContent,
      icon: Eye,
      color: "bg-green-500",
      href: "/admin/videos?status=published",
    },
    {
      label: "Drafts",
      value: stats.draftContent,
      icon: Edit,
      color: "bg-orange-500",
      href: "/admin/articles?status=draft",
    },
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to your admin panel. Manage your content here.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-primary-green/30 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400 group-hover:text-primary-green transition-colors" />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/videos/new">
            <Button className="bg-primary-green hover:bg-primary-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Video
            </Button>
          </Link>
          <Link href="/admin/articles/new">
            <Button className="bg-primary-orange hover:bg-primary-orange/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Article
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Videos */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Videos
            </h2>
            <Link
              href="/admin/videos"
              className="text-primary-green hover:underline text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {recentVideos.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentVideos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/admin/videos/${video.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {video.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(video.createdAt)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            video.status === "published"
                              ? "bg-green-100 text-green-700"
                              : video.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {video.status}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Video className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No videos yet</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Articles
            </h2>
            <Link
              href="/admin/articles"
              className="text-primary-green hover:underline text-sm flex items-center gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {recentArticles.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/admin/articles/${article.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(article.createdAt)}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            article.status === "published"
                              ? "bg-green-100 text-green-700"
                              : article.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {article.status}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No articles yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
