"use client";

import { color, motion } from "framer-motion";
import {
  Target,
  Heart,
  Eye,
  Shield,
  Users,
  TrendingUp,
  Lightbulb,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import BackgroundCircles from "@/components/ui/background-circles";
import Link from "next/link";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "We believe in complete honesty about investment risks and rewards. No hidden agendas, just straightforward guidance.",
    color: "primary-green",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Investment success is better when shared. We foster a supportive community where everyone can learn and grow together.",
    color: "primary-orange",
  },
  {
    icon: Lightbulb,
    title: "Education Over Hype",
    description:
      "We prioritize teaching sound investment principles over chasing trends or making quick promises.",
    color: "primary-peach",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description:
      "Quality investment education shouldn't be reserved for the wealthy. We make knowledge accessible to everyone.",
    color: "primary-green",
  },
];

const milestones = [
  {
    year: "XXXX",
    title: "Founded",
    description: "Started with a vision to democratize investment education",
  },
  {
    year: "XXXX",
    title: "Community Launch",
    description: "Opened doors to our first members",
  },
  {
    year: "XXXX",
    title: "Learning Hub",
    description: "Launched comprehensive educational platform",
  },
  {
    year: "XXXX",
    title: "Growing Community",
    description: "Expanding to serve investors everywhere",
  },
  {
    year: "Future",
    title: "XXXX",
    description: "...",
  },
];

const stats = [
  { value: "Growing", label: "Active Community", color: "text-primary-green" },
  {
    value: "Quality",
    label: "Educational Resources",
    color: "text-primary-orange",
  },
  { value: "Wide", label: "Reach", color: "text-primary-peach" },
  { value: "Dedicated", label: "Investors", color: "text-primary-green" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-green/10 text-primary-green px-4 py-2 rounded-full mb-6">
            <Target className="w-4 h-4" />
            <span className="text-sm font-medium">Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Empowering Everyone to{" "}
            <span className="text-primary-green">Build Wealth</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Investor&apos;s Edge was founded on a simple belief: that everyone
            deserves access to quality investment education and the tools to
            build their financial future.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
            >
              <p
                className={`text-2xl md:text-4xl font-bold ${stat.color} mb-2`}
              >
                {stat.value}
              </p>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-br from-primary-green to-primary-green/80 rounded-3xl p-8 text-white"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-white/80 text-lg">
              To democratize investment knowledge and empower individuals from
              all backgrounds to make informed financial decisions that lead to
              lasting wealth.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-gradient-to-br from-primary-orange to-primary-orange/80 rounded-3xl p-8 text-white"
          >
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-white/80 text-lg">
              A world where financial literacy is universal, and everyone has
              the confidence and knowledge to grow their wealth and secure their
              future.
            </p>
          </motion.div>
        </div>

        {/* Our Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-primary-peach rounded-3xl p-8 md:p-12 shadow-xl mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-white/80">
            <p className="mb-4">...</p>
            <p className="mb-4">...</p>
            <p>...</p>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div
                    className={`flex-1 ${
                      index % 2 === 0 ? "md:text-right" : "md:text-left"
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg inline-block">
                      <span className="text-primary-green font-bold text-lg">
                        {milestone.year}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-4 h-4 bg-primary-green rounded-full relative z-10" />
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.6, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div
                    className={`w-12 h-12 bg-${value.color}/10 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-6 h-6 text-${value.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Cards
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-gray-900 rounded-3xl p-8 text-white"
          >
            <Users className="w-12 h-12 text-primary-orange mb-4" />
            <h3 className="text-2xl font-bold mb-4">Meet Our Team</h3>
            <p className="text-gray-300 mb-6">
              Get to know the passionate people behind Investors Edge who are
              dedicated to your financial success.
            </p>
            <Link href="/about/team">
              <Button className="bg-white text-gray-900 hover:bg-white/90">
                View Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-primary-green rounded-3xl p-8 text-white"
          >
            <Award className="w-12 h-12 text-primary-orange mb-4" />
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <p className="text-white/80 mb-6">
              Have questions or want to partner with us? We'd love to hear from
              you.
            </p>
            <Link href="/about/contact">
              <Button className="bg-white text-primary-green hover:bg-white/90">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div> */}
      </div>
    </div>
  );
}
