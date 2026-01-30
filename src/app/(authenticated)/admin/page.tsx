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
  GraduationCap,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { stats, videos, articles, courses } = useAdmin();

  const recentVideos = videos.slice(0, 3);
  const recentArticles = articles.slice(0, 3);
  const recentCourses = courses.slice(0, 3);

  const statCards = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: GraduationCap,
      color: "bg-primary-green",
      href: "/admin/courses",
    },
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
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      default:
        return "outline";
    }
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
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
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
            <Card className="hover:border-primary-green/30 hover:shadow-md transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground group-hover:text-primary-green transition-colors" />
                </div>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/courses/new">
            <Button className="bg-primary-green hover:bg-primary-green/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Course
            </Button>
          </Link>
          <Link href="/admin/videos/new">
            <Button className="bg-blue-500 hover:bg-blue-500/90">
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
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Courses */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Recent Courses</CardTitle>
              <Link
                href="/admin/courses"
                className="text-primary-green hover:underline text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentCourses.length > 0 ? (
                <div className="divide-y">
                  {recentCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/admin/courses/${course.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(course.createdAt)}</span>
                          <Badge variant={getStatusVariant(course.status)}>
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <GraduationCap className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No courses yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Recent Videos */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Recent Videos</CardTitle>
              <Link
                href="/admin/videos"
                className="text-primary-green hover:underline text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentVideos.length > 0 ? (
                <div className="divide-y">
                  {recentVideos.map((video) => (
                    <Link
                      key={video.id}
                      href={`/admin/videos/${video.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Video className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(video.createdAt)}</span>
                          <Badge variant={getStatusVariant(video.status)}>
                            {video.status}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <Video className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No videos yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Articles */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl">Recent Articles</CardTitle>
              <Link
                href="/admin/articles"
                className="text-primary-green hover:underline text-sm flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {recentArticles.length > 0 ? (
                <div className="divide-y">
                  {recentArticles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/admin/articles/${article.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {article.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(article.createdAt)}</span>
                          <Badge variant={getStatusVariant(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>No articles yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
