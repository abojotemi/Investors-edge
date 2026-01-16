"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ArticleCategory, ContentStatus } from "@/types/admin";

const categories: { label: string; value: ArticleCategory }[] = [
  { label: "Investing Basics", value: "investing-basics" },
  { label: "Market News", value: "market-news" },
  { label: "Strategies", value: "strategies" },
  { label: "Personal Finance", value: "personal-finance" },
  { label: "Crypto", value: "crypto" },
  { label: "Real Estate", value: "real-estate" },
];

const statuses: { label: string; value: ContentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

export default function NewArticlePage() {
  const router = useRouter();
  const { addArticle } = useAdmin();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    category: "investing-basics" as ArticleCategory,
    tags: "",
    status: "draft" as ContentStatus,
    readTime: "",
    author: "Admin",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    if (!formData.readTime.trim()) {
      newErrors.readTime = "Read time is required";
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
      await addArticle({
        ...formData,
        status: publish ? "published" : formData.status,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      toast.success(publish ? "Article published" : "Article saved", {
        description: publish
          ? "Your article is now live."
          : "Your article has been saved as a draft.",
      });

      router.push("/admin/articles");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Error saving article", {
        description:
          "There was a problem saving your article. Please try again.",
      });
    } finally {
      setSaving(false);
    }
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

  // Calculate read time based on content
  const calculateReadTime = () => {
    const words = formData.content.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // Average reading speed
    setFormData((prev) => ({ ...prev, readTime: `${minutes} min read` }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Article
            </h1>
            <p className="text-gray-600 mt-1">
              Create a new article for your readers
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter article title"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none text-lg ${
                  errors.title ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article (shown in previews)"
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none resize-none ${
                  errors.excerpt ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Content *
                </label>
                <button
                  type="button"
                  onClick={calculateReadTime}
                  className="text-xs text-primary-green hover:underline"
                >
                  Calculate read time
                </button>
              </div>

              {/* Simple toolbar */}
              <div className="flex items-center gap-1 mb-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  title="Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-2 text-gray-600 hover:bg-gray-200 rounded"
                  title="Image"
                >
                  <Image className="w-4 h-4" />
                </button>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your article content here... (Markdown supported)"
                rows={15}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none resize-none font-mono text-sm ${
                  errors.content ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Supports Markdown formatting
              </p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Recommended size: 1200x630 pixels
              </p>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="investing, finance, tips"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Separate tags with commas
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Box */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Publish</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
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
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Read Time</h3>
              <input
                type="text"
                name="readTime"
                value={formData.readTime}
                onChange={handleChange}
                placeholder="5 min read"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none ${
                  errors.readTime ? "border-red-300" : "border-gray-200"
                }`}
              />
              {errors.readTime && (
                <p className="text-red-500 text-sm mt-1">{errors.readTime}</p>
              )}
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Preview</h3>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                {formData.featuredImage ? (
                  <img
                    src={formData.featuredImage}
                    alt="Featured preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <h4 className="font-medium text-gray-900 truncate">
                {formData.title || "Article Title"}
              </h4>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {formData.excerpt || "Article excerpt will appear here..."}
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
