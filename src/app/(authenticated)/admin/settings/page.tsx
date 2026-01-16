"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Bell, Shield, Palette, Globe } from "lucide-react";
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

export default function SettingsPage() {
  const { adminUser } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "Investor's Edge",
    siteDescription:
      "Learn to invest smarter with expert guidance and community support",
    contactEmail: "contact@investorsedge.com",
    enableNotifications: true,
    enableComments: true,
    moderateComments: true,
    requireApproval: false,
    defaultVideoStatus: "draft",
    defaultArticleStatus: "draft",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your admin panel and site settings
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-primary-green" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Admin Profile
            </h2>
            <p className="text-sm text-gray-500">Your account information</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          {adminUser?.photoURL ? (
            <img
              src={adminUser.photoURL}
              alt={adminUser.displayName}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {adminUser?.displayName?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">
              {adminUser?.displayName}
            </p>
            <p className="text-sm text-gray-500">{adminUser?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary-green bg-primary-green/10 px-2 py-1 rounded-full">
              <Shield className="w-3 h-3" />
              Administrator
            </span>
          </div>
        </div>
      </motion.div>

      {/* General Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              General Settings
            </h2>
            <p className="text-sm text-gray-500">Basic site configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <input
              type="text"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
            />
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-sm text-gray-500">
              Configure notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">
                Enable Email Notifications
              </p>
              <p className="text-sm text-gray-500">
                Receive email alerts for new comments and submissions
              </p>
            </div>
            <input
              type="checkbox"
              name="enableNotifications"
              checked={settings.enableNotifications}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
            />
          </label>
        </div>
      </motion.div>

      {/* Content Settings */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Content Settings
            </h2>
            <p className="text-sm text-gray-500">
              Configure content defaults and moderation
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Video Status
              </label>
              <select
                name="defaultVideoStatus"
                value={settings.defaultVideoStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Article Status
              </label>
              <select
                name="defaultArticleStatus"
                value={settings.defaultArticleStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Enable Comments</p>
              <p className="text-sm text-gray-500">
                Allow users to comment on articles and videos
              </p>
            </div>
            <input
              type="checkbox"
              name="enableComments"
              checked={settings.enableComments}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">Moderate Comments</p>
              <p className="text-sm text-gray-500">
                Review comments before they appear publicly
              </p>
            </div>
            <input
              type="checkbox"
              name="moderateComments"
              checked={settings.moderateComments}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <p className="font-medium text-gray-900">
                Require Admin Approval
              </p>
              <p className="text-sm text-gray-500">
                New content requires admin approval before publishing
              </p>
            </div>
            <input
              type="checkbox"
              name="requireApproval"
              checked={settings.requireApproval}
              onChange={handleChange}
              className="w-5 h-5 rounded border-gray-300 text-primary-green focus:ring-primary-green"
            />
          </label>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={itemVariants} className="flex justify-end gap-4">
        {saved && (
          <span className="flex items-center text-green-600 text-sm">
            ✓ Settings saved successfully
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary-green hover:bg-primary-green/90"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
