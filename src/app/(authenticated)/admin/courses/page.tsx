"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Clock,
  Archive,
  BookOpen,
  Users,
} from "lucide-react";
import { useAdmin } from "@/context/admin-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { ContentStatus, CourseDifficulty } from "@/types/admin";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const statusFilters: { label: string; value: ContentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const difficultyColors: Record<CourseDifficulty, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export default function CoursesPage() {
  const { courses, deleteCourse, updateCourse } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">(
    "all"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredCourses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCourses.map((c) => c.id));
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCourse(id);
      setShowDeleteConfirm(null);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      toast.success("Course deleted", {
        description: "The course has been permanently removed.",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error deleting course", {
        description:
          "There was a problem deleting the course. Please try again.",
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteCourse(id)));
      toast.success(`${selectedIds.length} courses deleted`, {
        description: "The selected courses have been removed.",
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Error bulk deleting courses:", error);
      toast.error("Error deleting courses", {
        description:
          "There was a problem deleting the courses. Please try again.",
      });
    }
  };

  const handleBulkStatusChange = async (status: ContentStatus) => {
    try {
      await Promise.all(
        selectedIds.map((id) => updateCourse(id, { status }))
      );
      toast.success(`Status updated`, {
        description: `${selectedIds.length} courses marked as ${status}.`,
      });
      setSelectedIds([]);
    } catch (error) {
      console.error("Error updating course status:", error);
      toast.error("Error updating status", {
        description:
          "There was a problem updating the status. Please try again.",
      });
    }
  };

  const getStatusVariant = (
    status: ContentStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage your educational course library
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button className="bg-primary-green hover:bg-primary-green/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <div className="flex gap-1">
                  {statusFilters.map((filter) => (
                    <Button
                      key={filter.value}
                      size="sm"
                      variant={
                        statusFilter === filter.value ? "default" : "secondary"
                      }
                      onClick={() => setStatusFilter(filter.value)}
                      className={
                        statusFilter === filter.value
                          ? "bg-primary-green hover:bg-primary-green/90"
                          : ""
                      }
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="mt-4 pt-4 border-t flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedIds.length} selected
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange("published")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange("draft")}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    <EyeOff className="w-4 h-4 mr-1" />
                    Unpublish
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkStatusChange("archived")}
                    className="text-muted-foreground"
                  >
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleBulkDelete}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Courses Table */}
      <motion.div variants={itemVariants}>
        <Card>
          {filteredCourses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.length === filteredCourses.length &&
                        filteredCourses.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(course.id)}
                        onCheckedChange={() => handleSelect(course.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary-green" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/courses/${course.id}`}
                            className="font-medium text-foreground hover:text-primary-green truncate block"
                          >
                            {course.title}
                          </Link>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded-full capitalize ${
                          difficultyColors[course.difficulty]
                        }`}
                      >
                        {course.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        {course.lessons.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {course.enrolledCount}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(course.status)}
                        className="capitalize"
                      >
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(course.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/courses/${course.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/learn/${course.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setShowDeleteConfirm(course.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <CardContent className="p-12 text-center">
              <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No courses found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Get started by adding your first course"}
              </p>
              <Link href="/admin/courses/new">
                <Button className="bg-primary-green hover:bg-primary-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </Link>
            </CardContent>
          )}
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AlertDialog
        open={!!showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
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
              onClick={() =>
                showDeleteConfirm && handleDelete(showDeleteConfirm)
              }
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
