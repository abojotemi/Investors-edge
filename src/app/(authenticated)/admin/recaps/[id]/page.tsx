"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Save,
  Eye,
  Loader2,
  Plus,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { toast } from "sonner";
import { getWeeklyRecap, updateWeeklyRecap } from "@/lib/firebase/firestore";
import type { ContentStatus, WeeklyRecap } from "@/types/admin";

export default function EditRecapPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    weekStartDate: "",
    weekEndDate: "",
    content: "",
    highlights: [""],
    status: "draft" as ContentStatus,
  });

  const recapId = params.id as string;

  useEffect(() => {
    const fetchRecap = async () => {
      try {
        const recap = await getWeeklyRecap(recapId);
        if (recap) {
          setFormData({
            title: recap.title,
            weekStartDate: recap.weekStartDate.toISOString().split("T")[0],
            weekEndDate: recap.weekEndDate.toISOString().split("T")[0],
            content: recap.content,
            highlights:
              recap.highlights.length > 0 ? recap.highlights : [""],
            status: recap.status,
          });
        }
      } catch (error) {
        console.error("Error fetching recap:", error);
        toast.error("Failed to load weekly recap");
      } finally {
        setLoading(false);
      }
    };

    fetchRecap();
  }, [recapId]);

  const handleAddHighlight = () => {
    setFormData({
      ...formData,
      highlights: [...formData.highlights, ""],
    });
  };

  const handleRemoveHighlight = (index: number) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      highlights: newHighlights.length > 0 ? newHighlights : [""],
    });
  };

  const handleHighlightChange = (index: number, value: string) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index] = value;
    setFormData({
      ...formData,
      highlights: newHighlights,
    });
  };

  const handleSubmit = async (status: ContentStatus) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!formData.weekStartDate || !formData.weekEndDate) {
      toast.error("Please select week dates");
      return;
    }
    if (!formData.content.trim()) {
      toast.error("Please enter content");
      return;
    }

    setSaving(true);
    try {
      const filteredHighlights = formData.highlights.filter((h) => h.trim());

      await updateWeeklyRecap(recapId, {
        title: formData.title,
        weekStartDate: new Date(formData.weekStartDate),
        weekEndDate: new Date(formData.weekEndDate),
        content: formData.content,
        highlights: filteredHighlights,
        status,
      });

      toast.success(
        status === "published"
          ? "Weekly recap published!"
          : "Weekly recap updated"
      );
      router.push("/admin/recaps");
    } catch (error) {
      console.error("Error updating recap:", error);
      toast.error("Failed to update weekly recap");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading weekly recap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/admin/recaps"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Weekly Recaps
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Edit Weekly Recap
          </h1>
          <p className="text-gray-600 mt-1">
            Update the weekly market highlights recap
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Week 4 January 2024 Market Recap"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Week Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weekStart">Week Start Date</Label>
                <Input
                  id="weekStart"
                  type="date"
                  value={formData.weekStartDate}
                  onChange={(e) =>
                    setFormData({ ...formData, weekStartDate: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="weekEnd">Week End Date</Label>
                <Input
                  id="weekEnd"
                  type="date"
                  value={formData.weekEndDate}
                  onChange={(e) =>
                    setFormData({ ...formData, weekEndDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Key Highlights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-green" />
                  Key Highlights
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddHighlight}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Highlight
                </Button>
              </div>
              <div className="space-y-2">
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Highlight ${index + 1}...`}
                      value={highlight}
                      onChange={(e) =>
                        handleHighlightChange(index, e.target.value)
                      }
                    />
                    {formData.highlights.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveHighlight(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rich Text Content */}
            <div>
              <Label htmlFor="content">Full Recap Content</Label>
              <div className="mt-2">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  placeholder="Write your detailed weekly market recap here..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => handleSubmit("draft")}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save as Draft
              </Button>
              <Button
                onClick={() => handleSubmit("published")}
                disabled={saving}
                className="bg-primary-green hover:bg-primary-green/90"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Publish
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
