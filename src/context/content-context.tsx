"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { useAuth } from "@/context/auth-context";
import {
  startCourse as startCourseFirestore,
  completeLessonProgress,
  updateCurrentLesson,
} from "@/lib/firebase/firestore";
import type {
  Video,
  Article,
  VideoCategory,
  ArticleCategory,
  ContentStatus,
  Course,
  CourseCategory,
  UserCourseProgress,
  Stock,
  StockStatus,
  StockSector,
} from "@/types/admin";

// Helper to convert Firestore timestamps to Date
const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

interface ContentContextType {
  videos: Video[];
  articles: Article[];
  courses: Course[];
  stocks: Stock[];
  userProgress: Map<string, UserCourseProgress>;
  loading: boolean;
  error: string | null;
  // Filtered content by category
  getVideosByCategory: (category: VideoCategory) => Video[];
  getArticlesByCategory: (category: ArticleCategory) => Article[];
  getCoursesByCategory: (category: CourseCategory) => Course[];
  // Search functionality
  searchVideos: (query: string) => Video[];
  searchArticles: (query: string) => Article[];
  searchCourses: (query: string) => Course[];
  // Course progress functions
  getCourseProgress: (courseId: string) => UserCourseProgress | undefined;
  startCourse: (courseId: string, firstLessonId: string) => Promise<void>;
  completeLesson: (
    courseId: string,
    lessonId: string,
    totalLessons: number,
    nextLessonId: string | null
  ) => Promise<void>;
  setCurrentLesson: (courseId: string, lessonId: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
};

interface ContentProviderProps {
  children: React.ReactNode;
}

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [userProgress, setUserProgress] = useState<
    Map<string, UserCourseProgress>
  >(new Map());
  const [videosLoading, setVideosLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [stocksLoading, setStocksLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Combined loading state - only false when all are loaded
  const loading = videosLoading || articlesLoading || coursesLoading || stocksLoading;

  // Handle Firestore errors with better messaging
  const handleFirestoreError = useCallback(
    (error: FirestoreError, context: string) => {
      console.error(`Error in ${context}:`, error);

      // Check if it's an index error
      if (error.code === "failed-precondition") {
        const indexMessage = `Firestore index required for ${context}. Check the browser console for the index creation link.`;
        console.error(indexMessage);
        console.error(
          "Create the required index by visiting the link in the error message above."
        );
        setError(indexMessage);
      } else if (error.code === "permission-denied") {
        setError(
          `Permission denied accessing ${context}. Check Firestore security rules.`
        );
      } else {
        setError(`Error loading ${context}: ${error.message}`);
      }
    },
    []
  );

  // Real-time listener for published videos
  useEffect(() => {
    const videosQuery = query(
      collection(db, "videos"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      videosQuery,
      (snapshot) => {
        const fetchedVideos: Video[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            thumbnailUrl: data.thumbnailUrl || "",
            videoUrl: data.videoUrl || "",
            duration: data.duration || "",
            category: data.category as VideoCategory,
            tags: data.tags || [],
            status: data.status as ContentStatus,
            author: data.author || "",
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };
        });
        setVideos(fetchedVideos);
        setVideosLoading(false);
        setError(null); // Clear any previous errors
        console.log("Real-time videos update:", fetchedVideos.length, "videos");
      },
      (error: FirestoreError) => {
        handleFirestoreError(error, "videos");
        setVideosLoading(false);
      }
    );

    return () => unsubscribe();
  }, [handleFirestoreError]);

  // Real-time listener for published articles
  useEffect(() => {
    const articlesQuery = query(
      collection(db, "articles"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      articlesQuery,
      (snapshot) => {
        const fetchedArticles: Article[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            featuredImage: data.featuredImage || "",
            category: data.category as ArticleCategory,
            tags: data.tags || [],
            status: data.status as ContentStatus,
            readTime: data.readTime || "",
            author: data.author || "",
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };
        });
        setArticles(fetchedArticles);
        setArticlesLoading(false);
        setError(null); // Clear any previous errors
        console.log(
          "Real-time articles update:",
          fetchedArticles.length,
          "articles"
        );
      },
      (error: FirestoreError) => {
        handleFirestoreError(error, "articles");
        setArticlesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [handleFirestoreError]);

  // Real-time listener for published courses
  useEffect(() => {
    const coursesQuery = query(
      collection(db, "courses"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      coursesQuery,
      (snapshot) => {
        const fetchedCourses: Course[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            thumbnailUrl: data.thumbnailUrl || "",
            category: data.category as CourseCategory,
            difficulty: data.difficulty || "beginner",
            lessons: data.lessons || [],
            totalDuration: data.totalDuration || "",
            enrolledCount: data.enrolledCount || 0,
            status: data.status as ContentStatus,
            tags: data.tags || [],
            author: data.author || "",
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };
        });
        setCourses(fetchedCourses);
        setCoursesLoading(false);
        setError(null);
        console.log(
          "Real-time courses update:",
          fetchedCourses.length,
          "courses"
        );
      },
      (error: FirestoreError) => {
        handleFirestoreError(error, "courses");
        setCoursesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [handleFirestoreError]);

  // Real-time listener for active stocks
  useEffect(() => {
    const stocksQuery = query(
      collection(db, "stocks"),
      where("status", "==", "active"),
      orderBy("dateAdded", "desc")
    );

    const unsubscribe = onSnapshot(
      stocksQuery,
      (snapshot) => {
        const fetchedStocks: Stock[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            ticker: data.ticker || "",
            sector: data.sector as StockSector,
            description: data.description || "",
            analysis: data.analysis || "",
            entryPrice: data.entryPrice || 0,
            targetPrice: data.targetPrice || 0,
            stopLoss: data.stopLoss || 0,
            status: data.status as StockStatus,
            dateAdded: convertTimestamp(data.dateAdded),
            dateClosed: data.dateClosed ? convertTimestamp(data.dateClosed) : undefined,
            closingPrice: data.closingPrice,
            closingNotes: data.closingNotes,
            createdAt: convertTimestamp(data.createdAt),
            updatedAt: convertTimestamp(data.updatedAt),
          };
        });
        setStocks(fetchedStocks);
        setStocksLoading(false);
        console.log(
          "Real-time stocks update:",
          fetchedStocks.length,
          "stocks"
        );
      },
      (error: FirestoreError) => {
        handleFirestoreError(error, "stocks");
        setStocksLoading(false);
      }
    );

    return () => unsubscribe();
  }, [handleFirestoreError]);

  // Real-time listener for user course progress
  useEffect(() => {
    if (!user?.uid) {
      setUserProgress(new Map());
      return;
    }

    const progressQuery = query(
      collection(db, "courseProgress"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      progressQuery,
      (snapshot) => {
        const progressMap = new Map<string, UserCourseProgress>();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          progressMap.set(data.courseId, {
            id: doc.id,
            odUserId: data.userId,
            courseId: data.courseId,
            completedLessons: data.completedLessons || [],
            currentLessonId: data.currentLessonId || null,
            progressPercent: data.progressPercent || 0,
            startedAt: convertTimestamp(data.startedAt),
            lastAccessedAt: convertTimestamp(data.lastAccessedAt),
            completedAt: data.completedAt
              ? convertTimestamp(data.completedAt)
              : null,
          });
        });
        setUserProgress(progressMap);
        console.log("Real-time progress update:", progressMap.size, "courses");
      },
      (error: FirestoreError) => {
        handleFirestoreError(error, "course progress");
      }
    );

    return () => unsubscribe();
  }, [user?.uid, handleFirestoreError]);

  // Filter videos by category
  const getVideosByCategory = useMemo(
    () => (category: VideoCategory) => {
      return videos.filter((video) => video.category === category);
    },
    [videos]
  );

  // Filter articles by category
  const getArticlesByCategory = useMemo(
    () => (category: ArticleCategory) => {
      return articles.filter((article) => article.category === category);
    },
    [articles]
  );

  // Search videos
  const searchVideos = useMemo(
    () => (searchQuery: string) => {
      const lowerQuery = searchQuery.toLowerCase();
      return videos.filter(
        (video) =>
          video.title.toLowerCase().includes(lowerQuery) ||
          video.description.toLowerCase().includes(lowerQuery) ||
          video.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [videos]
  );

  // Search articles
  const searchArticles = useMemo(
    () => (searchQuery: string) => {
      const lowerQuery = searchQuery.toLowerCase();
      return articles.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [articles]
  );

  // Filter courses by category
  const getCoursesByCategory = useMemo(
    () => (category: CourseCategory) => {
      return courses.filter((course) => course.category === category);
    },
    [courses]
  );

  // Search courses
  const searchCourses = useMemo(
    () => (searchQuery: string) => {
      const lowerQuery = searchQuery.toLowerCase();
      return courses.filter(
        (course) =>
          course.title.toLowerCase().includes(lowerQuery) ||
          course.description.toLowerCase().includes(lowerQuery) ||
          course.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [courses]
  );

  // Get progress for a specific course
  const getCourseProgress = useCallback(
    (courseId: string) => {
      return userProgress.get(courseId);
    },
    [userProgress]
  );

  // Start a course
  const startCourse = useCallback(
    async (courseId: string, firstLessonId: string) => {
      if (!user?.uid) throw new Error("User must be logged in");
      await startCourseFirestore(user.uid, courseId, firstLessonId);
    },
    [user?.uid]
  );

  // Complete a lesson
  const completeLesson = useCallback(
    async (
      courseId: string,
      lessonId: string,
      totalLessons: number,
      nextLessonId: string | null
    ) => {
      if (!user?.uid) throw new Error("User must be logged in");
      await completeLessonProgress(
        user.uid,
        courseId,
        lessonId,
        totalLessons,
        nextLessonId
      );
    },
    [user?.uid]
  );

  // Set current lesson
  const setCurrentLesson = useCallback(
    async (courseId: string, lessonId: string) => {
      if (!user?.uid) throw new Error("User must be logged in");
      await updateCurrentLesson(user.uid, courseId, lessonId);
    },
    [user?.uid]
  );

  const value: ContentContextType = {
    videos,
    articles,
    courses,
    stocks,
    userProgress,
    loading,
    error,
    getVideosByCategory,
    getArticlesByCategory,
    getCoursesByCategory,
    searchVideos,
    searchArticles,
    searchCourses,
    getCourseProgress,
    startCourse,
    completeLesson,
    setCurrentLesson,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
