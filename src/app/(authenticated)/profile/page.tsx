"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  UserCircle,
  Camera,
  GraduationCap,
  Shield,
  Briefcase,
  Target,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import BackgroundCircles from "@/components/ui/background-circles";
import Link from "next/link";
import { toast } from "sonner";
import type {
  ExperienceLevel,
  RiskTolerance,
  InvestmentGoal,
} from "@/types/admin";

const experienceLevels: {
  value: ExperienceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "Beginner",
    label: "Beginner",
    description: "New to investing, learning the basics",
  },
  {
    value: "Intermediate",
    label: "Intermediate",
    description: "Understand fundamentals, some experience",
  },
  {
    value: "Advanced",
    label: "Advanced",
    description: "Experienced investor with diverse portfolio",
  },
  {
    value: "Expert",
    label: "Expert",
    description: "Professional-level knowledge and experience",
  },
];

const riskTolerances: {
  value: RiskTolerance;
  label: string;
  description: string;
}[] = [
  {
    value: "Conservative",
    label: "Conservative",
    description: "Prefer stability, minimize losses",
  },
  {
    value: "Moderate",
    label: "Moderate",
    description: "Balance between growth and safety",
  },
  {
    value: "Aggressive",
    label: "Aggressive",
    description: "Willing to take higher risks for returns",
  },
];

const investmentGoals: {
  value: InvestmentGoal;
  label: string;
  description: string;
}[] = [
  {
    value: "Long-term Growth",
    label: "Long-term Growth",
    description: "Build wealth over time",
  },
  {
    value: "Income Generation",
    label: "Income Generation",
    description: "Generate regular income from investments",
  },
  {
    value: "Capital Preservation",
    label: "Capital Preservation",
    description: "Protect existing wealth",
  },
  {
    value: "Speculation",
    label: "Speculation",
    description: "Short-term gains with higher risk",
  },
  {
    value: "Retirement",
    label: "Retirement",
    description: "Save for retirement",
  },
];

const sectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
  "Consumer Goods",
  "Real Estate",
  "Industrial",
  "Materials",
  "Utilities",
  "Telecommunications",
  "Cryptocurrency",
];

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    experienceLevel: "Beginner" as ExperienceLevel,
    riskTolerance: "Moderate" as RiskTolerance,
    investmentGoal: "Long-term Growth" as InvestmentGoal,
    preferredSectors: [] as string[],
  });

  useEffect(() => {
    if (user && userProfile) {
      setFormData({
        displayName: user.displayName || userProfile.displayName || "",
        bio: userProfile.bio || "",
        experienceLevel: userProfile.experienceLevel || "Beginner",
        riskTolerance: userProfile.riskTolerance || "Moderate",
        investmentGoal: userProfile.investmentGoal || "Long-term Growth",
        preferredSectors: userProfile.preferredSectors || [],
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.displayName || "",
      }));
    }
  }, [user, userProfile]);

  const handleSectorToggle = (sector: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredSectors: prev.preferredSectors.includes(sector)
        ? prev.preferredSectors.filter((s) => s !== sector)
        : [...prev.preferredSectors, sector],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (updateUserProfile) {
        await updateUserProfile(formData);
      }
      toast.success("Profile updated", {
        description: "Your profile has been saved successfully.",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile", {
        description: "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-green/5 via-primary-orange/5 to-primary-green/10 pt-24 pb-16 relative">
      <BackgroundCircles variant="sparse" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/home"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-green transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-600 mt-1">
            Tell us about yourself and your investment preferences
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary-green/10 flex items-center justify-center overflow-hidden">
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
                <button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary-green text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-green/90 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Your profile picture is synced with your Google account.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all resize-none"
                  placeholder="Tell us about yourself and your investment journey..."
                />
              </div>
            </div>
          </motion.div>

          {/* Experience Level */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary-green" />
              <h2 className="text-lg font-semibold text-gray-900">
                Experience Level
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, experienceLevel: level.value })
                  }
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.experienceLevel === level.value
                      ? "border-primary-green bg-primary-green/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{level.label}</p>
                  <p className="text-sm text-gray-500">{level.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Risk Tolerance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary-orange" />
              <h2 className="text-lg font-semibold text-gray-900">
                Risk Tolerance
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {riskTolerances.map((risk) => (
                <button
                  key={risk.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, riskTolerance: risk.value })
                  }
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.riskTolerance === risk.value
                      ? "border-primary-orange bg-primary-orange/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{risk.label}</p>
                  <p className="text-sm text-gray-500">{risk.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Investment Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary-peach" />
              <h2 className="text-lg font-semibold text-gray-900">
                Investment Goal
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {investmentGoals.map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, investmentGoal: goal.value })
                  }
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.investmentGoal === goal.value
                      ? "border-primary-peach bg-primary-peach/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="font-medium text-gray-900">{goal.label}</p>
                  <p className="text-sm text-gray-500">{goal.description}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Preferred Sectors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary-green" />
              <h2 className="text-lg font-semibold text-gray-900">
                Preferred Sectors
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select the sectors you&apos;re most interested in investing
            </p>
            <div className="flex flex-wrap gap-2">
              {sectors.map((sector) => (
                <button
                  key={sector}
                  type="button"
                  onClick={() => handleSectorToggle(sector)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.preferredSectors.includes(sector)
                      ? "bg-primary-green text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sector}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-end gap-4"
          >
            {saved && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-primary-green"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Profile saved!</span>
              </motion.div>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="bg-primary-green hover:bg-primary-green/90 text-white px-8"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
