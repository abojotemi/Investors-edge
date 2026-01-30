"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  BookOpen,
  Lightbulb,
  Users,
  BarChart3,
  Target,
  ArrowRight,
  Sparkles,
  Play,
  FileText,
  Calendar,
  MessageSquare,
  Building2,
  Info,
  Mail,
  UserCircle,
  Edit3,
  Shield,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";

const sections = [
  {
    title: "Stocks",
    description:
      "Track real-time market data, analyze stocks, and monitor your watchlist",
    href: "/stocks",
    icon: TrendingUp,
    color: "bg-primary-green",
    lightColor: "bg-primary-green/10",
    textColor: "text-primary-green",
  },
  {
    title: "Learn",
    description:
      "Access educational videos and articles to improve your investing knowledge",
    href: "/learn",
    icon: BookOpen,
    color: "bg-primary-peach",
    lightColor: "bg-primary-peach/10",
    textColor: "text-primary-peach",
  },
  {
    title: "Insights",
    description:
      "Get expert market analysis, reports, and investment strategies",
    href: "/insights",
    icon: Lightbulb,
    color: "bg-primary-orange",
    lightColor: "bg-primary-orange/10",
    textColor: "text-primary-orange",
  },
  {
    title: "Community",
    description:
      "Connect with fellow investors, join discussions, and share experiences",
    href: "/community",
    icon: Users,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  // {
  //   title: "Opportunities",
  //   description:
  //     "Discover curated investment opportunities and emerging markets",
  //   href: "/opportunities",
  //   icon: Target,
  //   color: "bg-rose-500",
  //   lightColor: "bg-rose-50",
  //   textColor: "text-rose-600",
  // },
  {
    title: "Forum",
    description:
      "Participate in community forums to ask questions and share insights",
    href: "/community/forum",
    icon: BarChart3,
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50",
    textColor: "text-cyan-600",
  },
];

const quickLinks = [
  { title: "Watch Videos", href: "/learn", icon: Play },
  { title: "Read Articles", href: "/learn", icon: FileText },
  { title: "Upcoming Events", href: "/community/events", icon: Calendar },
  { title: "Forum Discussions", href: "/community/forum", icon: MessageSquare },
  { title: "About Us", href: "/about", icon: Info },
  { title: "Contact", href: "/about/contact", icon: Mail },
];

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
    transition: { duration: 0.5 },
  },
};

export default function AuthenticatedHomePage() {
  const { user, userProfile } = useAuth();

  // User is guaranteed to exist by the authenticated layout
  const firstName =
    user?.displayName?.split(" ")[0] ||
    userProfile?.displayName?.split(" ")[0] ||
    "Investor";
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16 relative">
      <BackgroundCircles variant="dense" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary-orange" />
                <span className="text-sm font-medium text-primary-orange">
                  {greeting}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Welcome back,{" "}
                <span className="text-primary-green">{firstName}</span>
              </h1>
              <p className="text-lg text-gray-600">
                What would you like to explore today?
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {sections.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <Link href={section.href}>
                <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 h-full">
                  <div
                    className={`w-14 h-14 ${section.lightColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <section.icon className={`w-7 h-7 ${section.textColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {section.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-primary-green opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore{" "}
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Links Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-green/30 transition-all duration-300 text-center group">
                  <link.icon className="w-6 h-6 text-gray-400 mx-auto mb-2 group-hover:text-primary-green transition-colors" />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {link.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div> */}

        {/* My Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <Link href="/profile">
              <Button
                variant="outline"
                size="sm"
                className="border-primary-green text-primary-green hover:bg-primary-green hover:text-white"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Avatar */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-primary-green/10 flex items-center justify-center">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "Profile"}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-16 h-16 text-primary-green" />
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {user?.displayName || "Set your name"}
                  </h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                {/* Profile Stats/Tags */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-green/10 rounded-full">
                    <GraduationCap className="w-4 h-4 text-primary-green" />
                    <span className="text-sm font-medium text-primary-green">
                      {userProfile?.experienceLevel || "Beginner"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-orange/10 rounded-full">
                    <Shield className="w-4 h-4 text-primary-orange" />
                    <span className="text-sm font-medium text-primary-orange">
                      {userProfile?.riskTolerance || "Moderate"} Risk
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-peach/10 rounded-full">
                    <Briefcase className="w-4 h-4 text-primary-peach" />
                    <span className="text-sm font-medium text-primary-peach">
                      {userProfile?.investmentGoal || "Long-term Growth"}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm">
                  {userProfile?.bio ||
                    "Tell us about yourself and your investment journey. Click 'Edit Profile' to add your bio."}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-primary-green/10 via-primary-orange/10 to-primary-peach/10 rounded-2xl p-8">
            <Building2 className="w-10 h-10 text-primary-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Build Your Financial Future
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every great investor started somewhere. Keep learning, stay
              consistent, and watch your wealth grow over time.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
