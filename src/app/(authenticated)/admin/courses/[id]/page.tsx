"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Eye,
  GraduationCap,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { getCourse as fetchCourseFromFirebase } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import RichTextEditor from "@/components/ui/rich-text-editor";
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
import { toast } from "sonner";
import type {
  CourseCategory,
  CourseDifficulty,
  ContentStatus,
  CourseLesson,
} from "@/types/admin";

const categories: { label: string; value: CourseCategory }[] = [
  { label: "Investing Basics", value: "investing-basics" },
  { label: "Stock Analysis", value: "stock-analysis" },
  { label: "Portfolio Management", value: "portfolio-management" },
  { label: "Trading Strategies", value: "trading-strategies" },
  { label: "Financial Planning", value: "financial-planning" },
  { label: "Cryptocurrency", value: "crypto" },
];

const difficulties: { label: string; value: CourseDifficulty }[] = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const statuses: { label: string; value: ContentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

interface LessonFormData {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  content: string;
  order: number;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { getCourse, updateCourse, deleteCourse, loading: adminLoading } = useAdmin();
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    category: "investing-basics" as CourseCategory,
    difficulty: "beginner" as CourseDifficulty,
    tags: "",
    status: "draft" as ContentStatus,
    author: "",
    enrolledCount: 0,
  });

  const [lessons, setLessons] = useState<LessonFormData[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadCourse = async () => {
      // First try to get from context
      const courseFromContext = getCourse(courseId);
      if (courseFromContext) {
        setFormData({
          title: courseFromContext.title,
          description: courseFromContext.description,
          thumbnailUrl: courseFromContext.thumbnailUrl,
          category: courseFromContext.category,
          difficulty: courseFromContext.difficulty,
          tags: courseFromContext.tags.join(", "),
          status: courseFromContext.status,
          author: courseFromContext.author,
          enrolledCount: courseFromContext.enrolledCount,
        });
        setLessons(
          courseFromContext.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            duration: l.duration,
            videoUrl: l.videoUrl || "",
            content: l.content || "",
            order: l.order,
          }))
        );
        setIsLoading(false);
        return;
      }

      if (adminLoading) {
        return;
      }

      // Fetch from Firebase
      try {
        const courseFromFirebase = await fetchCourseFromFirebase(courseId);
        if (courseFromFirebase) {
          setFormData({
            title: courseFromFirebase.title,
            description: courseFromFirebase.description,
            thumbnailUrl: courseFromFirebase.thumbnailUrl,
            category: courseFromFirebase.category,
            difficulty: courseFromFirebase.difficulty,
            tags: courseFromFirebase.tags.join(", "),
            status: courseFromFirebase.status,
            author: courseFromFirebase.author,
            enrolledCount: courseFromFirebase.enrolledCount,
          });
          setLessons(
            courseFromFirebase.lessons.map((l) => ({
              id: l.id,
              title: l.title,
              description: l.description,
              duration: l.duration,
              videoUrl: l.videoUrl || "",
              content: l.content || "",
              order: l.order,
            }))
          );
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId, getCourse, adminLoading]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addLesson = () => {
    const newLesson: LessonFormData = {
      id: generateId(),
      title: "",
      description: "",
      duration: "",
      videoUrl: "",
      content: "",
      order: lessons.length + 1,
    };
    setLessons([...lessons, newLesson]);
    setExpandedLesson(newLesson.id);
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((l) => l.id !== id).map((l, i) => ({ ...l, order: i + 1 })));
    if (expandedLesson === id) {
      setExpandedLesson(null);
    }
  };

  const updateLessonField = (id: string, field: keyof LessonFormData, value: string) => {
    setLessons(
      lessons.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const moveLesson = (index: number, direction: "up" | "down") => {
    const newLessons = [...lessons];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;
    
    [newLessons[index], newLessons[targetIndex]] = [newLessons[targetIndex], newLessons[index]];
    setLessons(newLessons.map((l, i) => ({ ...l, order: i + 1 })));
  };

  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    lessons.forEach((lesson) => {
      const parts = lesson.duration.split(":");
      if (parts.length === 2) {
        totalMinutes += parseInt(parts[0]) * 60 + parseInt(parts[1]);
      } else if (parts.length === 1 && parts[0]) {
        totalMinutes += parseInt(parts[0]);
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (lessons.length === 0) {
      newErrors.lessons = "At least one lesson is required";
    }

    lessons.forEach((lesson, index) => {
      if (!lesson.title.trim()) {
        newErrors[`lesson_${index}_title`] = "Lesson title is required";
      }
    });

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
      const courseLessons: CourseLesson[] = lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || "",
        duration: lesson.duration || "0:00",
        videoUrl: lesson.videoUrl || "",
        content: lesson.content || "",
        order: lesson.order,
      }));

      await updateCourse(courseId, {
        ...formData,
        status: publish ? "published" : formData.status,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        lessons: courseLessons,
        totalDuration: calculateTotalDuration(),
      });

      toast.success(publish ? "Course published" : "Course updated", {
        description: publish
          ? "Your course is now live."
          : "Your changes have been saved.",
      });

      router.push("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course", {
        description: "There was a problem saving your changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(courseId);
      toast.success("Course deleted", {
        description: "The course has been permanently removed.",
      });
      router.push("/admin/courses");
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course", {
        description: "There was a problem deleting the course. Please try again.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <Loader2 className="w-16 h-16 text-primary-green mx-auto mb-4 animate-spin" />
        <p className="text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-5xl mx-auto text-center py-12">
        <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Course Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/admin/courses">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
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
            href="/admin/courses"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
            <p className="text-muted-foreground mt-1">Update course details</p>
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
                  Course Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter course title"
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
                  placeholder="Enter course description"
                  rows={4}
                  className={errors.description ? "border-red-300" : ""}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Lessons */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle>Lessons</CardTitle>
                <Button
                  type="button"
                  size="sm"
                  onClick={addLesson}
                  className="bg-primary-green hover:bg-primary-green/90"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Lesson
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.lessons && (
                  <p className="text-red-500 text-sm">{errors.lessons}</p>
                )}
                {lessons.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No lessons yet. Add your first lesson to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div
                          className="flex items-center gap-3 p-3 bg-muted/50 cursor-pointer"
                          onClick={() =>
                            setExpandedLesson(
                              expandedLesson === lesson.id ? null : lesson.id
                            )
                          }
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="flex-1 font-medium">
                            {lesson.title || "Untitled Lesson"}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLesson(index, "up");
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLesson(index, "down");
                              }}
                              disabled={index === lessons.length - 1}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeLesson(lesson.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {expandedLesson === lesson.id && (
                          <div className="p-4 space-y-4 border-t">
                            <div>
                              <Label className="mb-2">Lesson Title *</Label>
                              <Input
                                value={lesson.title}
                                onChange={(e) =>
                                  updateLessonField(lesson.id, "title", e.target.value)
                                }
                                placeholder="Enter lesson title"
                                className={
                                  errors[`lesson_${index}_title`]
                                    ? "border-red-300"
                                    : ""
                                }
                              />
                              {errors[`lesson_${index}_title`] && (
                                <p className="text-red-500 text-sm mt-1">
                                  {errors[`lesson_${index}_title`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <Label className="mb-2">Description</Label>
                              <Textarea
                                value={lesson.description}
                                onChange={(e) =>
                                  updateLessonField(lesson.id, "description", e.target.value)
                                }
                                placeholder="Enter lesson description"
                                rows={2}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="mb-2">Duration</Label>
                                <Input
                                  value={lesson.duration}
                                  onChange={(e) =>
                                    updateLessonField(lesson.id, "duration", e.target.value)
                                  }
                                  placeholder="e.g., 15:30"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                  Format: MM:SS
                                </p>
                              </div>
                              <div>
                                <Label className="mb-2">Video URL</Label>
                                <Input
                                  value={lesson.videoUrl}
                                  onChange={(e) =>
                                    updateLessonField(lesson.id, "videoUrl", e.target.value)
                                  }
                                  placeholder="https://..."
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="mb-2">Lesson Content</Label>
                              <RichTextEditor
                                value={lesson.content}
                                onChange={(value) =>
                                  updateLessonField(lesson.id, "content", value)
                                }
                                placeholder="Write your lesson content here..."
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
                  Recommended size: 800x450 pixels
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
                      category: value as CourseCategory,
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

            {/* Difficulty */}
            <Card>
              <CardHeader>
                <CardTitle>Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: value as CourseDifficulty,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Course Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lessons</span>
                  <span className="font-medium">{lessons.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="font-medium">{calculateTotalDuration()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enrolled</span>
                  <span className="font-medium">{formData.enrolledCount}</span>
                </div>
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
                    <GraduationCap className="w-12 h-12 text-muted-foreground/30" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this course? This action cannot be
              undone and all lessons will be removed.
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
