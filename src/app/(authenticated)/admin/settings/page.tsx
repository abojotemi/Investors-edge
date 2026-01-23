"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Save,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import {
  getSettings,
  updateSettings,
  SiteSettings,
} from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<SiteSettings>({
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

  // Load settings from Firebase on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const fetchedSettings = await getSettings();
        setSettings(fetchedSettings);
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

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
    try {
      await updateSettings(settings);
      setSaved(true);
      toast.success("Settings saved successfully");
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Loader2 className="w-16 h-16 text-primary-green mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your admin panel and site settings
        </p>
      </motion.div>

      {/* Profile Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-green/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-green" />
              </div>
              <div>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
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
                <p className="font-semibold">{adminUser?.displayName}</p>
                <p className="text-sm text-muted-foreground">
                  {adminUser?.email}
                </p>
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-primary-green bg-primary-green/10 px-2 py-1 rounded-full">
                  <Shield className="w-3 h-3" />
                  Administrator
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* General Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site configuration</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="mb-2">
                Site Name
              </Label>
              <Input
                id="siteName"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription" className="mb-2">
                Site Description
              </Label>
              <Input
                id="siteDescription"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contactEmail" className="mb-2">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure notification preferences
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Enable Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive email alerts for new comments and submissions
                </p>
              </div>
              <Checkbox
                id="enableNotifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableNotifications: checked as boolean,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Settings */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>
                  Configure content defaults and moderation
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Default Video Status</Label>
                <Select
                  value={settings.defaultVideoStatus}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultVideoStatus: value as "draft" | "published",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Default Article Status</Label>
                <Select
                  value={settings.defaultArticleStatus}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      defaultArticleStatus: value as "draft" | "published",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Enable Comments</p>
                <p className="text-sm text-muted-foreground">
                  Allow users to comment on articles and videos
                </p>
              </div>
              <Checkbox
                id="enableComments"
                checked={settings.enableComments}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    enableComments: checked as boolean,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Moderate Comments</p>
                <p className="text-sm text-muted-foreground">
                  Review comments before they appear publicly
                </p>
              </div>
              <Checkbox
                id="moderateComments"
                checked={settings.moderateComments}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    moderateComments: checked as boolean,
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1">
                <p className="font-medium">Require Admin Approval</p>
                <p className="text-sm text-muted-foreground">
                  New content requires admin approval before publishing
                </p>
              </div>
              <Checkbox
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({
                    ...prev,
                    requireApproval: checked as boolean,
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>
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
