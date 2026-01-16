"use client";

import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail, Award, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import Link from "next/link";

const leadership = [
  {
    name: "Alexandra Chen",
    role: "CEO & Co-Founder",
    bio: "Former portfolio manager with 15+ years in asset management. Passionate about making investment education accessible to everyone.",
    avatar: "AC",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Marcus Williams",
    role: "CTO & Co-Founder",
    bio: "Tech entrepreneur and software engineer. Built multiple fintech platforms before co-founding Investor's Edge.",
    avatar: "MW",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sarah Thompson",
    role: "Chief Investment Officer",
    bio: "CFA with expertise in portfolio construction. Previously managed $2B+ in institutional assets.",
    avatar: "ST",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "David Park",
    role: "Head of Education",
    bio: "Former professor of finance. Published author on behavioral economics and personal investing.",
    avatar: "DP",
    linkedin: "#",
    twitter: "#",
  },
];

const team = [
  { name: "Jennifer Adams", role: "Content Director", avatar: "JA" },
  { name: "Michael Brown", role: "Community Manager", avatar: "MB" },
  { name: "Emily Rodriguez", role: "Senior Analyst", avatar: "ER" },
  { name: "Chris Nguyen", role: "Product Manager", avatar: "CN" },
  { name: "Rachel Kim", role: "Marketing Lead", avatar: "RK" },
  { name: "James Wilson", role: "Customer Success", avatar: "JW" },
  { name: "Lisa Chang", role: "Data Scientist", avatar: "LC" },
  { name: "Robert Taylor", role: "Backend Engineer", avatar: "RT" },
];

const advisors = [
  {
    name: "Dr. Elizabeth Moore",
    role: "Academic Advisor",
    affiliation: "Stanford Graduate School of Business",
    avatar: "EM",
  },
  {
    name: "Richard Hayes",
    role: "Industry Advisor",
    affiliation: "Former VP at Goldman Sachs",
    avatar: "RH",
  },
  {
    name: "Michelle Zhang",
    role: "Technology Advisor",
    affiliation: "Partner at Sequoia Capital",
    avatar: "MZ",
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

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-24 pb-16 relative">
      <BackgroundCircles />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary-orange/10 text-primary-orange px-4 py-2 rounded-full mb-6">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Our Team</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet the <span className="text-primary-green">People</span> Behind
            the Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A diverse team of investors, educators, and technologists united by
            a shared mission to democratize investment knowledge.
          </p>
        </motion.div>

        {/* Leadership */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Leadership Team
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {leadership.map((person, index) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.2, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary-green/30 transition-all"
              >
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-green to-primary-green/60 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-white">
                      {person.avatar}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-primary-green font-medium mb-3">
                      {person.role}
                    </p>
                    <p className="text-gray-500 text-sm mb-4">{person.bio}</p>
                    <div className="flex items-center gap-3">
                      <a
                        href={person.linkedin}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-primary-green hover:text-white transition-all"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a
                        href={person.twitter}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-primary-green hover:text-white transition-all"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Core Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Core Team</h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {team.map((person) => (
              <motion.div
                key={person.name}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center group cursor-pointer hover:border-primary-green/30 transition-all"
              >
                <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-green group-hover:text-white transition-all">
                  <span className="font-semibold text-primary-green group-hover:text-white transition-all">
                    {person.avatar}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{person.name}</h3>
                <p className="text-gray-500 text-sm">{person.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Advisors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Advisory Board
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary-orange/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-primary-orange">
                      {advisor.avatar}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {advisor.name}
                    </h3>
                    <p className="text-primary-green text-sm font-medium">
                      {advisor.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{advisor.affiliation}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join the Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-r from-primary-green to-primary-green/80 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a
            difference in financial education. Check out our open positions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-green hover:bg-white/90 px-8">
              View Open Positions
            </Button>
            <Link href="/about/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
