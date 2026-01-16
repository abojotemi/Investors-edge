"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  ExternalLink,
  Bell,
  Filter,
  Play,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";

const eventTypes = [
  { id: "all", label: "All Events" },
  { id: "webinar", label: "Webinars" },
  { id: "workshop", label: "Workshops" },
  { id: "qa", label: "Q&A Sessions" },
  { id: "meetup", label: "Meetups" },
];

const events = [
  {
    id: 1,
    title: "Investment Basics: Getting Started in 2024",
    type: "webinar",
    description:
      "Perfect for beginners! Learn the fundamentals of investing, asset allocation, and building your first portfolio.",
    date: "March 15, 2024",
    time: "7:00 PM EST",
    duration: "90 minutes",
    host: "Sarah Chen, CFP",
    isLive: false,
    isUpcoming: true,
    isFeatured: true,
    image: "📊",
  },
  {
    id: 2,
    title: "Real Estate Investing Workshop",
    type: "workshop",
    description:
      "Hands-on workshop covering REIT analysis, property evaluation, and building a real estate portfolio.",
    date: "March 18, 2024",
    time: "2:00 PM EST",
    duration: "2 hours",
    host: "Marcus Johnson",
    isLive: false,
    isUpcoming: true,
    isFeatured: false,
    image: "🏠",
  },
  {
    id: 3,
    title: "Live Q&A: Ask Our Experts Anything",
    type: "qa",
    description:
      "Got questions? Our panel of financial experts will answer your investment questions live.",
    date: "March 20, 2024",
    time: "6:00 PM EST",
    duration: "60 minutes",
    host: "Investor's Edge Team",
    isLive: false,
    isUpcoming: true,
    isFeatured: true,
    image: "❓",
  },
  {
    id: 4,
    title: "Cryptocurrency Deep Dive",
    type: "webinar",
    description:
      "Understanding blockchain, evaluating crypto projects, and managing risk in digital assets.",
    date: "March 22, 2024",
    time: "8:00 PM EST",
    duration: "75 minutes",
    host: "Alex Rivera",
    isLive: false,
    isUpcoming: true,
    isFeatured: false,
    image: "🪙",
  },
  {
    id: 5,
    title: "NYC Investor Meetup",
    type: "meetup",
    description:
      "Network with fellow investors in New York City. Great opportunity to connect and share experiences.",
    date: "March 25, 2024",
    time: "6:30 PM EST",
    duration: "3 hours",
    host: "NYC Chapter",
    isLive: false,
    isUpcoming: true,
    isFeatured: false,
    location: "Manhattan, NY",
    image: "🗽",
  },
  {
    id: 6,
    title: "Retirement Planning Masterclass",
    type: "workshop",
    description:
      "Comprehensive workshop on 401(k)s, IRAs, Social Security optimization, and retirement withdrawal strategies.",
    date: "March 28, 2024",
    time: "1:00 PM EST",
    duration: "2.5 hours",
    host: "Jennifer Adams, CFA",
    isLive: false,
    isUpcoming: true,
    isFeatured: true,
    image: "🎯",
  },
];

const pastEvents = [
  {
    id: 101,
    title: "Tax-Efficient Investing Strategies",
    type: "webinar",
    date: "February 28, 2024",
    hasRecording: true,
    image: "📑",
  },
  {
    id: 102,
    title: "Building Passive Income Streams",
    type: "workshop",
    date: "February 20, 2024",
    hasRecording: true,
    image: "💰",
  },
  {
    id: 103,
    title: "Market Outlook 2024",
    type: "webinar",
    date: "February 15, 2024",
    hasRecording: true,
    image: "📈",
  },
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
    transition: {
      duration: 0.5,
    },
  },
};

export default function EventsPage() {
  const [selectedType, setSelectedType] = useState("all");

  const filteredEvents = events.filter(
    (event) => selectedType === "all" || event.type === selectedType
  );

  const featuredEvent = filteredEvents.find((e) => e.isFeatured);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      webinar: "bg-blue-100 text-blue-700",
      workshop: "bg-purple-100 text-purple-700",
      qa: "bg-green-100 text-green-700",
      meetup: "bg-orange-100 text-orange-700",
    };
    return colors[type] || "bg-gray-100 text-gray-700";
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      webinar: "Webinar",
      workshop: "Workshop",
      qa: "Q&A Session",
      meetup: "Meetup",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary-peach/10 text-primary-peach px-4 py-2 rounded-full mb-6">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Upcoming Events</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Events & <span className="text-primary-green">Webinars</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn from experts, connect with fellow investors, and accelerate
            your investment journey through our live events.
          </p>
        </motion.div>

        {/* Featured Event */}
        {featuredEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-gradient-to-r from-primary-green to-primary-green/80 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row items-start gap-8">
                <div className="text-8xl">{featuredEvent.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary-orange" />
                    <span className="text-sm font-medium text-white/80">
                      Featured Event
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full bg-white/20`}
                    >
                      {getTypeLabel(featuredEvent.type)}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {featuredEvent.title}
                  </h2>
                  <p className="text-lg text-white/80 mb-6">
                    {featuredEvent.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      <span>Online Event</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-white text-primary-green hover:bg-white/90">
                      Register Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">
              Filter by type
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedType === type.id
                    ? "bg-primary-green text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{event.image}</div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                      event.type
                    )}`}
                  >
                    {getTypeLabel(event.type)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-green transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-primary-green" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-primary-orange" />
                    <span>
                      {event.time} • {event.duration}
                    </span>
                  </div>
                  {event.location ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary-peach" />
                      <span>{event.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Video className="w-4 h-4 text-primary-peach" />
                      <span>Online Event</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Open for registration</span>
                  </div>
                </div>

                <Button className="w-full bg-gray-100 text-gray-700 hover:bg-primary-green hover:text-white transition-all">
                  Register
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Past Events with Recordings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Past Events with Recordings
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{event.image}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-green transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Recording available
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary-green hover:bg-primary-green/10"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch Recording
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <Bell className="w-12 h-12 text-primary-orange mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Never Miss an Event</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to get notified about upcoming webinars, workshops, and
            community events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
            />
            <Button className="bg-primary-orange hover:bg-primary-orange/90 text-white px-8">
              Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
