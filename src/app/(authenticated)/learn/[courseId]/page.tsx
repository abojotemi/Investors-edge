"use client";

import { useParams } from "next/navigation";
import { useContent } from "@/context/content-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RichTextViewer from "@/components/ui/rich-text-viewer";

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    courses,
    getCourseProgress,
    startCourse,
    completeLesson,
    setCurrentLesson,
  } = useContent();
  const course = courses.find((c) => c.id === courseId);
  const progress = getCourseProgress(courseId);
  const [loading, setLoading] = useState(false);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-green animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Loading course...</p>
      </div>
    );
  }

  // Find current lesson
  const currentLessonIdx = progress?.currentLessonId
    ? course.lessons.findIndex((l) => l.id === progress.currentLessonId)
    : 0;
  const currentLesson = course.lessons[currentLessonIdx] || course.lessons[0];

  // Handlers
  const handleStart = async () => {
    setLoading(true);
    await startCourse(course.id, course.lessons[0].id);
    setLoading(false);
  };

  const handleComplete = async () => {
    setLoading(true);
    const nextIdx = currentLessonIdx + 1;
    const nextLessonId =
      nextIdx < course.lessons.length ? course.lessons[nextIdx].id : null;
    await completeLesson(
      course.id,
      currentLesson.id,
      course.lessons.length,
      nextLessonId
    );
    if (nextLessonId) {
      await setCurrentLesson(course.id, nextLessonId);
    }
    setLoading(false);
  };

  // Progress bar
  const percent = progress?.progressPercent || 0;
  const isCompleted = percent >= 100;

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-primary-green font-medium mb-6"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Courses
      </Link>

      <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-primary-green flex items-center justify-center text-white text-2xl font-bold">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              {course.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {course.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span className="inline-flex items-center gap-1 text-xs bg-primary-green/10 text-primary-green px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" /> {course.totalDuration}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-primary-orange/10 text-primary-orange px-2 py-1 rounded-full">
            {course.lessons.length} lessons
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-foreground">{percent}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5 }}
              className={cn(
                "h-full rounded-full",
                isCompleted ? "bg-primary-green" : "bg-primary-orange"
              )}
            />
          </div>
        </div>
      </div>

      {/* Lessons Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {course.lessons.map((lesson, idx) => {
          const completed = progress?.completedLessons.includes(lesson.id);
          const isCurrent = lesson.id === currentLesson.id;
          return (
            <button
              key={lesson.id}
              onClick={() => setCurrentLesson(course.id, lesson.id)}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-lg border transition-all",
                isCurrent
                  ? "bg-primary-green/10 border-primary-green text-primary-green"
                  : completed
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              )}
            >
              <span className="text-xs font-semibold mb-1">
                Lesson {idx + 1}
              </span>
              <span className="text-xs line-clamp-1 max-w-[80px]">
                {lesson.title}
              </span>
              {completed && (
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lesson Content */}
      <div className="bg-white rounded-xl shadow border border-border/40 p-6 mb-8">
        <h2 className="text-lg font-bold mb-2">{currentLesson.title}</h2>
        <p className="text-muted-foreground text-sm mb-4">
          {currentLesson.description}
        </p>
        {currentLesson.videoUrl && (
          <div className="aspect-video mb-4">
            <iframe
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              allowFullScreen
              className="w-full h-full rounded-lg border"
            />
          </div>
        )}
        {currentLesson.content && (
          <RichTextViewer content={currentLesson.content} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={currentLessonIdx === 0 || loading}
          onClick={() =>
            setCurrentLesson(course.id, course.lessons[currentLessonIdx - 1].id)
          }
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        {isCompleted ? (
          <Button size="sm" disabled className="bg-primary-green text-white">
            <CheckCircle2 className="w-4 h-4 mr-1" /> Course Completed
          </Button>
        ) : progress ? (
          <Button
            size="sm"
            className="bg-primary-green text-white"
            onClick={handleComplete}
            disabled={loading}
          >
            <CheckCircle2 className="w-4 h-4 mr-1" /> Mark as Complete
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-primary-orange text-white"
            onClick={handleStart}
            disabled={loading}
          >
            <Play className="w-4 h-4 mr-1" /> Start Course
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={currentLessonIdx === course.lessons.length - 1 || loading}
          onClick={() =>
            setCurrentLesson(course.id, course.lessons[currentLessonIdx + 1].id)
          }
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
