"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save, Eye, Video as VideoIcon } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { VideoCategory, ContentStatus } from "@/types/admin";

const categories: { label: string; value: VideoCategory }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Market Analysis", value: "market-analysis" },
  { label: "Tutorials", value: "tutorials" },
  { label: "Webinars", value: "webinars" },
];

const statuses: { label: string; value: ContentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function NewVideoPage() {
  const router = useRouter();
  const { addVideo, adminUser } = useAdmin();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    duration: "",
    category: "beginner" as VideoCategory,
    tags: "",
    status: "draft" as ContentStatus,
    author: "",
  });

  // Set author when adminUser is loaded
  useEffect(() => {
    if (adminUser?.displayName && !formData.author) {
      setFormData((prev) => ({ ...prev, author: adminUser.displayName }));
    }
  }, [adminUser, formData.author]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    }
    if (!formData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, publish = false) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Validation error", {
        description: "Please fill in all required fields.",
      });
      return;
    }

    setSaving(true);

    try {
      await addVideo({
        ...formData,
        status: publish ? "published" : formData.status,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      toast.success(publish ? "Video published" : "Video saved", {
        description: publish
          ? "Your video is now live."
          : "Your video has been saved as a draft.",
      });

      router.push("/admin/videos");
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Error saving video", {
        description: "There was a problem saving your video. Please try again.",
      });
    } finally {
      setSaving(false);
    }

    router.push("/admin/videos");
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/videos"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Add New Video
            </h1>
            <p className="text-muted-foreground mt-1">
              Create a new video for your content library
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="title" className="mb-2">
                  Video Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter video title"
                  className={errors.title ? "border-red-300" : ""}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="description" className="mb-2">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter video description"
                  rows={5}
                  className={errors.description ? "border-red-300" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Video URL */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="videoUrl" className="mb-2">
                  Video URL *
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className={errors.videoUrl ? "border-red-300" : ""}
                />
                {errors.videoUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Supports YouTube, Vimeo, or direct video links
                </p>
              </CardContent>
            </Card>

            {/* Thumbnail URL */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="thumbnailUrl" className="mb-2">
                  Thumbnail URL
                </Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 1280x720 pixels
                </p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="tags" className="mb-2">
                  Tags
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="investing, stocks, beginner"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Separate tags with commas
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Box */}
            <Card>
              <CardHeader>
                <CardTitle>Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as ContentStatus,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="secondary"
                    className="flex-1"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={(e) => handleSubmit(e, true)}
                    className="flex-1 bg-primary-green hover:bg-primary-green/90"
                    disabled={saving}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: value as VideoCategory,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Duration */}
            <Card>
              <CardHeader>
                <CardTitle>Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="15:30"
                  className={errors.duration ? "border-red-300" : ""}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Format: MM:SS
                </p>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  {formData.thumbnailUrl ? (
                    <img
                      src={formData.thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <VideoIcon className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
