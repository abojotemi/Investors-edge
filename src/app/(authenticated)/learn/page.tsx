"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  ChevronRight,
  Loader2,
  GraduationCap,
  TrendingUp,
  BarChart3,
  Target,
  Wallet,
  Bitcoin,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { cn } from "@/lib/utils";
import type { Course, CourseCategory, CourseDifficulty } from "@/types/admin";

// Category configuration with colors and icons
const categoryConfig: Record<
  CourseCategory,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  "investing-basics": {
    label: "Investing Basics",
    color: "text-primary-green",
    bgColor: "bg-primary-green",
    icon: <GraduationCap className="w-5 h-5" />,
  },
  "stock-analysis": {
    label: "Stock Analysis",
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    icon: <BarChart3 className="w-5 h-5" />,
  },
  "portfolio-management": {
    label: "Portfolio Management",
    color: "text-purple-600",
    bgColor: "bg-purple-500",
    icon: <Target className="w-5 h-5" />,
  },
  "trading-strategies": {
    label: "Trading Strategies",
    color: "text-primary-orange",
    bgColor: "bg-primary-orange",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  "financial-planning": {
    label: "Financial Planning",
    color: "text-teal-600",
    bgColor: "bg-teal-500",
    icon: <Wallet className="w-5 h-5" />,
  },
  crypto: {
    label: "Cryptocurrency",
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    icon: <Bitcoin className="w-5 h-5" />,
  },
};

// Difficulty badge colors
const difficultyColors: Record<CourseDifficulty, string> = {
  beginner: "bg-green-100 text-green-700 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  advanced: "bg-red-100 text-red-700 border-red-200",
};

// Course card background colors (like the reference image)
const cardBgColors = [
  "bg-gradient-to-br from-amber-100 to-amber-50",
  "bg-gradient-to-br from-orange-100 to-orange-50",
  "bg-gradient-to-br from-blue-100 to-blue-50",
  "bg-gradient-to-br from-red-100 to-red-50",
  "bg-gradient-to-br from-green-100 to-green-50",
  "bg-gradient-to-br from-purple-100 to-purple-50",
];

// Sidebar navigation items
const sidebarItems = [
  { id: "all", label: "All Courses", icon: <BookOpen className="w-4 h-4" /> },
  {
    id: "in-progress",
    label: "In Progress",
    icon: <Play className="w-4 h-4" />,
  },
  {
    id: "completed",
    label: "Completed",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
];

// Course Card Component
const CourseCard = ({
  course,
  progress,
  index,
}: {
  course: Course;
  progress?: { percent: number; isCompleted: boolean };
  index: number;
}) => {
  const config = categoryConfig[course.category];
  const bgColor = cardBgColors[index % cardBgColors.length];

  return (
    <Link href={`/learn/${course.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "group relative rounded-2xl overflow-hidden shadow-lg border border-border/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1",
          bgColor
        )}
      >
        {/* Card Header with Icon */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-4">
            {/* Course Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg",
                config.bgColor
              )}
            >
              {config.icon}
            </div>

            {/* Enrolled Count */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/80 px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              <span>{course.enrolledCount}</span>
            </div>
          </div>

          {/* Course Title */}
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary-green transition-colors">
            {course.title}
          </h3>

          {/* Course Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* Course Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.totalDuration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{course.lessons.length} lessons</span>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
              difficultyColors[course.difficulty]
            )}
          >
            {course.difficulty}
          </div>
        </div>

        {/* Progress Section */}
        <div className="px-5 pb-5">
          {progress ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">
                  {progress.percent}%
                </span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percent}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className={cn(
                    "h-full rounded-full",
                    progress.isCompleted
                      ? "bg-primary-green"
                      : "bg-primary-orange"
                  )}
                />
              </div>
              {progress.isCompleted && (
                <div className="flex items-center gap-1 text-xs text-primary-green font-medium">
                  <Award className="w-3.5 h-3.5" />
                  <span>Completed</span>
                </div>
              )}
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-white hover:bg-white/90 text-foreground border border-border/50 shadow-sm group-hover:border-primary-green group-hover:text-primary-green transition-colors"
            >
              Start Course
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary-green/0 group-hover:bg-primary-green/5 transition-colors pointer-events-none" />
      </motion.div>
    </Link>
  );
};

// Stats Card Component
const StatsCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-white rounded-xl p-4 shadow-lg border border-border/50"
  >
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center text-white",
          color
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  </motion.div>
);

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory | null>(null);
  const { courses, loading, getCourseProgress, userProgress } = useContent();

  // Calculate stats
  const inProgressCount = Array.from(userProgress.values()).filter(
    (p) => p.progressPercent > 0 && p.progressPercent < 100
  ).length;
  const completedCount = Array.from(userProgress.values()).filter(
    (p) => p.progressPercent >= 100
  ).length;

  // Filter courses based on active filter and category
  const filteredCourses = courses.filter((course) => {
    // Category filter
    if (selectedCategory && course.category !== selectedCategory) {
      return false;
    }

    // Status filter
    if (activeFilter === "in-progress") {
      const progress = getCourseProgress(course.id);
      return progress && progress.progressPercent > 0 && progress.progressPercent < 100;
    }
    if (activeFilter === "completed") {
      const progress = getCourseProgress(course.id);
      return progress && progress.progressPercent >= 100;
    }

    return true;
  });

  // Get the current date formatted
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10">
      <BackgroundCircles variant="dense" />

      <section className="relative py-6 sm:py-8 md:py-10 px-4 bg-gradient-to-br from-primary-peach/5 via-background to-primary-green/5 overflow-hidden flex-1">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary-green/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-primary-orange/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg border border-border/50 p-4 sticky top-24"
              >
                {/* Logo/Brand */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
                  <div className="w-8 h-8 rounded-lg bg-primary-green flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg text-foreground">
                    Courses
                  </span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 mb-6">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveFilter(item.id);
                        setSelectedCategory(null);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        activeFilter === item.id && !selectedCategory
                          ? "bg-primary-green/10 text-primary-green"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.id === "in-progress" && inProgressCount > 0 && (
                        <span className="ml-auto bg-primary-orange/20 text-primary-orange text-xs px-2 py-0.5 rounded-full">
                          {inProgressCount}
                        </span>
                      )}
                      {item.id === "completed" && completedCount > 0 && (
                        <span className="ml-auto bg-primary-green/20 text-primary-green text-xs px-2 py-0.5 rounded-full">
                          {completedCount}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* Categories */}
                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Categories
                  </p>
                  <nav className="space-y-1">
                    {Object.entries(categoryConfig).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedCategory(key as CourseCategory);
                          setActiveFilter("all");
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all",
                          selectedCategory === key
                            ? "bg-primary-green/10 text-primary-green font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-md flex items-center justify-center text-white text-xs",
                            config.bgColor
                          )}
                        >
                          {config.icon}
                        </div>
                        <span className="truncate">{config.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Upgrade Card (like reference) */}
                {/* <div className="mt-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white">
                  <p className="text-xs text-slate-300 mb-1">
                    Upgrade your plan
                  </p>
                  <p className="text-sm font-semibold mb-3">Pro Plan</p>
                  <div className="w-8 h-1 bg-primary-green rounded-full" />
                </div> */}
              </motion.div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    Course Activity
                  </h1>
                  <p className="text-sm text-muted-foreground">{currentDate}</p>
                </div>

                {/* Add Course Button (for future admin use) */}
                <Button
                  size="sm"
                  className="bg-primary-green hover:bg-primary-green/90 text-white self-start sm:self-auto"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All
                </Button>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
              >
                <StatsCard
                  icon={<BookOpen className="w-5 h-5" />}
                  label="Total Courses"
                  value={courses.length}
                  color="bg-primary-green"
                />
                <StatsCard
                  icon={<Play className="w-5 h-5" />}
                  label="In Progress"
                  value={inProgressCount}
                  color="bg-primary-orange"
                />
                <StatsCard
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  label="Completed"
                  value={completedCount}
                  color="bg-blue-500"
                />
                <StatsCard
                  icon={<Award className="w-5 h-5" />}
                  label="Certificates"
                  value={completedCount}
                  color="bg-purple-500"
                />
              </motion.div>

              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between mb-4"
              >
                <h2 className="text-lg font-semibold text-foreground">
                  {selectedCategory
                    ? categoryConfig[selectedCategory].label
                    : activeFilter === "in-progress"
                    ? "Continue Learning"
                    : activeFilter === "completed"
                    ? "Completed Courses"
                    : "All Courses"}
                </h2>
                {(selectedCategory || activeFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveFilter("all");
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear Filter
                  </Button>
                )}
              </motion.div>

              {/* Courses Grid */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                  {filteredCourses.map((course, index) => {
                    const progress = getCourseProgress(course.id);
                    return (
                      <CourseCard
                        key={course.id}
                        course={course}
                        progress={
                          progress
                            ? {
                                percent: progress.progressPercent,
                                isCompleted: progress.progressPercent >= 100,
                              }
                            : undefined
                        }
                        index={index}
                      />
                    );
                  })}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    {activeFilter === "in-progress"
                      ? "You haven't started any courses yet. Browse all courses to begin learning!"
                      : activeFilter === "completed"
                      ? "You haven't completed any courses yet. Keep learning!"
                      : "No courses are available in this category yet. Check back soon!"}
                  </p>
                  {activeFilter !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveFilter("all")}
                      className="mt-4"
                    >
                      Browse All Courses
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-center text-muted-foreground text-sm"
              >
                <p>
                  More courses coming soon! Have suggestions?{" "}
                  <span className="text-primary-green font-semibold cursor-pointer hover:underline">
                    Let us know
                  </span>
                </p>
              </motion.div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
