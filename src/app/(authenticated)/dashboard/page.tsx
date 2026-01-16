"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Target,
  BookOpen,
  Award,
  Calendar,
  Bell,
  Settings,
  ChevronRight,
  Plus,
  PieChart,
  Play,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import BackgroundCircles from "@/components/ui/background-circles";

// Mock data for dashboard
const portfolioSummary = {
  totalValue: 47850.32,
  totalChange: 2340.56,
  percentageChange: 5.14,
  isPositive: true,
};

const assetAllocation = [
  { name: "Stocks", percentage: 45, color: "#236f62", value: 21532.64 },
  { name: "Real Estate", percentage: 25, color: "#faba26", value: 11962.58 },
  { name: "Bonds", percentage: 20, color: "#e26844", value: 9570.06 },
  { name: "Crypto", percentage: 10, color: "#6366f1", value: 4785.04 },
];

const goals = [
  {
    id: 1,
    title: "Emergency Fund",
    target: 10000,
    current: 8500,
    deadline: "June 2024",
    status: "on-track",
  },
  {
    id: 2,
    title: "Retirement Savings",
    target: 500000,
    current: 47850,
    deadline: "2050",
    status: "on-track",
  },
  {
    id: 3,
    title: "House Down Payment",
    target: 60000,
    current: 12000,
    deadline: "December 2025",
    status: "behind",
  },
];

const recentActivity = [
  {
    id: 1,
    type: "course",
    title: "Completed: Investment Basics 101",
    time: "2 hours ago",
    icon: BookOpen,
  },
  {
    id: 2,
    type: "goal",
    title: "Updated Emergency Fund goal",
    time: "5 hours ago",
    icon: Target,
  },
  {
    id: 3,
    type: "insight",
    title: "Read: Market Outlook 2024",
    time: "1 day ago",
    icon: TrendingUp,
  },
  {
    id: 4,
    type: "community",
    title: "Posted in Discussion Forum",
    time: "2 days ago",
    icon: Award,
  },
];

const recommendedCourses = [
  {
    id: 1,
    title: "Real Estate Investing Fundamentals",
    progress: 0,
    duration: "2.5 hours",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Building a Dividend Portfolio",
    progress: 35,
    duration: "1.5 hours",
    level: "Intermediate",
  },
  {
    id: 3,
    title: "Risk Management Strategies",
    progress: 0,
    duration: "2 hours",
    level: "Advanced",
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Investment Q&A Session",
    date: "Mar 15",
    time: "7:00 PM EST",
  },
  { id: 2, title: "Real Estate Workshop", date: "Mar 18", time: "2:00 PM EST" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("1M");

  const periods = ["1W", "1M", "3M", "6M", "1Y", "ALL"];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back,{" "}
              <span className="text-primary-green">
                {user?.displayName?.split(" ")[0] || "Investor"}
              </span>
            </h1>
            <p className="text-gray-600 mt-1">
              Here&apos;s an overview of your investment journey
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button variant="outline" size="sm" className="border-gray-300">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" className="border-gray-300">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Portfolio & Goals */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Portfolio Overview
                </h2>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {periods.map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 text-sm rounded-md transition-all ${
                        selectedPeriod === period
                          ? "bg-primary-green text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Total Portfolio Value
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    $
                    {portfolioSummary.totalValue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    portfolioSummary.isPositive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {portfolioSummary.isPositive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span className="font-semibold">
                    ${portfolioSummary.totalChange.toLocaleString()} (
                    {portfolioSummary.percentageChange}%)
                  </span>
                  <span className="text-sm text-gray-500">this month</span>
                </div>
              </div>

              {/* Placeholder chart area */}
              <div className="h-48 bg-gradient-to-r from-primary-green/5 to-primary-green/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-primary-green/30 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Portfolio performance chart
                  </p>
                </div>
              </div>

              {/* Asset Allocation */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Asset Allocation
                </p>
                <div className="space-y-3">
                  {assetAllocation.map((asset) => (
                    <div key={asset.name} className="flex items-center gap-4">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">
                            {asset.name}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${asset.value.toLocaleString()} ({asset.percentage}
                            %)
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${asset.percentage}%`,
                              backgroundColor: asset.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Investment Goals
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-green hover:bg-primary-green/10"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Goal
                </Button>
              </div>

              <div className="space-y-4">
                {goals.map((goal) => {
                  const progress = (goal.current / goal.target) * 100;
                  return (
                    <div
                      key={goal.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {goal.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Target: {goal.deadline}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            goal.status === "on-track"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {goal.status === "on-track" ? "On Track" : "Behind"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-green rounded-full transition-all"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          ${goal.current.toLocaleString()} / $
                          {goal.target.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Learning Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Continue Learning
                </h2>
                <Link href="/learn">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-green hover:bg-primary-green/10"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-primary-green/10 rounded-xl flex items-center justify-center group-hover:bg-primary-green transition-all">
                      {course.progress > 0 ? (
                        <Play className="w-5 h-5 text-primary-green group-hover:text-white" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-primary-green group-hover:text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>{course.duration}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{course.level}</span>
                      </div>
                      {course.progress > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-green rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">
                            {course.progress}%
                          </span>
                        </div>
                      )}
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-primary-green" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Activity & Events */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="bg-gradient-to-br from-primary-green to-primary-green/80 rounded-2xl p-6 text-white"
            >
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/opportunities">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Explore
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn
                  </Button>
                </Link>
                <Link href="/community">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Community
                  </Button>
                </Link>
                <Link href="/insights">
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-0 justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Insights
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Upcoming Events
                </h2>
                <Link href="/community/events">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-green hover:bg-primary-green/10"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="text-center">
                      <Calendar className="w-5 h-5 text-primary-orange mx-auto mb-1" />
                      <p className="text-xs font-semibold text-primary-orange">
                        {event.date}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm truncate">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-green hover:bg-primary-green/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-primary-green" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              >
                <MoreHorizontal className="w-4 h-4 mr-2" />
                View All Activity
              </Button>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-2xl p-6 text-white text-center"
            >
              <Award className="w-12 h-12 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Active Learner</h3>
              <p className="text-sm text-white/80 mb-3">
                You&apos;ve completed 5 courses this month!
              </p>
              <Button className="bg-white text-primary-orange hover:bg-white/90 w-full">
                View Achievements
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
