"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save, Eye, FileText, Trash2, Loader2 } from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { getArticle as fetchArticleFromFirebase } from "@/lib/firebase/firestore";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { FileUpload } from "@/components/ui/file-upload";
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

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const {
    getArticle,
    updateArticle,
    deleteArticle,
    loading: adminLoading,
  } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadArticle = async () => {
      // First try to get from context (faster if already loaded)
      const articleFromContext = getArticle(articleId);
      if (articleFromContext) {
        setFormData({
          title: articleFromContext.title,
          excerpt: articleFromContext.excerpt,
          content: articleFromContext.content,
          featuredImage: articleFromContext.featuredImage,
          category: articleFromContext.category,
          tags: articleFromContext.tags.join(", "),
          status: articleFromContext.status,
          readTime: articleFromContext.readTime,
          author: articleFromContext.author,
        });
        setIsLoading(false);
        return;
      }

      // If not in context and admin data is still loading, wait
      if (adminLoading) {
        return;
      }

      // If admin data is loaded but article not found in context, fetch from Firebase
      try {
        const articleFromFirebase = await fetchArticleFromFirebase(articleId);
        if (articleFromFirebase) {
          setFormData({
            title: articleFromFirebase.title,
            excerpt: articleFromFirebase.excerpt,
            content: articleFromFirebase.content,
            featuredImage: articleFromFirebase.featuredImage,
            category: articleFromFirebase.category,
            tags: articleFromFirebase.tags.join(", "),
            status: articleFromFirebase.status,
            readTime: articleFromFirebase.readTime,
            author: articleFromFirebase.author,
          });
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [articleId, getArticle, adminLoading]);

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
      await updateArticle(articleId, {
        ...formData,
        status: publish ? "published" : formData.status,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      toast.success(publish ? "Article published" : "Article updated", {
        description: publish
          ? "Your article is now live."
          : "Your changes have been saved.",
      });

      router.push("/admin/articles");
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Error updating article", {
        description:
          "There was a problem saving your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArticle(articleId);
      toast.success("Article deleted", {
        description: "The article has been permanently removed.",
      });
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article", {
        description:
          "There was a problem deleting the article. Please try again.",
      });
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
    const minutes = Math.ceil(words / 200);
    setFormData((prev) => ({ ...prev, readTime: `${minutes} min read` }));
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Loader2 className="w-16 h-16 text-primary-green mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Article Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The article you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/articles">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>
    );
  }

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
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Article</h1>
            <p className="text-muted-foreground mt-1">Update article details</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowDeleteConfirm(true)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="title" className="mb-2">
                  Article Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter article title"
                  className={`text-lg ${errors.title ? "border-red-300" : ""}`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="excerpt" className="mb-2">
                  Excerpt *
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of the article (shown in previews)"
                  rows={3}
                  className={errors.excerpt ? "border-red-300" : ""}
                />
                {errors.excerpt && (
                  <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>
                )}
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Label>Content *</Label>
                  <button
                    type="button"
                    onClick={calculateReadTime}
                    className="text-xs text-primary-green hover:underline"
                  >
                    Calculate read time
                  </button>
                </div>

                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => {
                    setFormData((prev) => ({ ...prev, content }));
                    if (errors.content) {
                      setErrors((prev) => ({ ...prev, content: "" }));
                    }
                  }}
                  placeholder="Start writing your article content..."
                  error={!!errors.content}
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  Use the toolbar to format text, add headings, lists, links,
                  and images. Switch between Edit, Split, and Preview modes.
                </p>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card>
              <CardContent className="p-6">
                <Label className="mb-2">Featured Image</Label>
                <FileUpload
                  type="images"
                  currentUrl={formData.featuredImage}
                  onUploadComplete={(url) =>
                    setFormData((prev) => ({ ...prev, featuredImage: url }))
                  }
                  label="Upload Featured Image"
                />
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Or enter URL directly:
                  </p>
                  <Input
                    type="url"
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="text-sm"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Recommended size: 1200x630 pixels
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
                  placeholder="investing, finance, tips"
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
                    Save
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
                      category: value as ArticleCategory,
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

            {/* Read Time */}
            <Card>
              <CardHeader>
                <CardTitle>Read Time</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="5 min read"
                  className={errors.readTime ? "border-red-300" : ""}
                />
                {errors.readTime && (
                  <p className="text-red-500 text-sm mt-1">{errors.readTime}</p>
                )}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  {formData.featuredImage ? (
                    <img
                      src={formData.featuredImage}
                      alt="Featured preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
                <h4 className="font-medium text-foreground truncate">
                  {formData.title || "Article Title"}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {formData.excerpt || "Article excerpt will appear here..."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
