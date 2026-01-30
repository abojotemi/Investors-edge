import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type {
  Video,
  Article,
  ContentStatus,
  VideoCategory,
  ArticleCategory,
  Discussion,
  DiscussionCategory,
  DiscussionStatus,
  DiscussionAuthor,
  Reply,
  WeeklyRecap,
} from "@/types/admin";

// Helper to convert Firestore timestamps to Date
const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

// Helper to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// ==================== VIDEOS ====================

export const videosCollection = collection(db, "videos");

export const getVideos = async (): Promise<Video[]> => {
  try {
    const q = query(videosCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

export const getVideo = async (id: string): Promise<Video | null> => {
  try {
    const docRef = doc(db, "videos", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
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
  } catch (error) {
    console.error("Error fetching video:", error);
    return null;
  }
};

export const addVideo = async (
  video: Omit<Video, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(videosCollection, {
      ...video,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Video added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding video:", error);
    throw error;
  }
};

export const updateVideo = async (
  id: string,
  updates: Partial<Video>
): Promise<void> => {
  try {
    const docRef = doc(db, "videos", id);
    // Remove id, createdAt from updates - use underscore prefix for unused vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...updateData } = updates;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    console.log("Video updated:", id);
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
};

export const deleteVideo = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "videos", id);
    await deleteDoc(docRef);
    console.log("Video deleted:", id);
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
};

// ==================== ARTICLES ====================

export const articlesCollection = collection(db, "articles");

export const getArticles = async (): Promise<Article[]> => {
  try {
    const q = query(articlesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export const getArticle = async (id: string): Promise<Article | null> => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
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
  } catch (error) {
    console.error("Error fetching article:", error);
    return null;
  }
};

export const getArticleBySlug = async (
  slug: string
): Promise<Article | null> => {
  try {
    const q = query(articlesCollection, where("slug", "==", slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
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
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
};

export const addArticle = async (
  article: Omit<Article, "id" | "createdAt" | "updatedAt" | "slug">
): Promise<string> => {
  try {
    const docRef = await addDoc(articlesCollection, {
      ...article,
      slug: generateSlug(article.title),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Article added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding article:", error);
    throw error;
  }
};

export const updateArticle = async (
  id: string,
  updates: Partial<Article>
): Promise<void> => {
  try {
    const docRef = doc(db, "articles", id);
    // Remove id, createdAt from updates, recalculate slug if title changed
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...updateData } = updates;
    const finalUpdates = {
      ...updateData,
      updatedAt: serverTimestamp(),
      ...(updates.title ? { slug: generateSlug(updates.title) } : {}),
    };
    await updateDoc(docRef, finalUpdates);
    console.log("Article updated:", id);
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "articles", id);
    await deleteDoc(docRef);
    console.log("Article deleted:", id);
  } catch (error) {
    console.error("Error deleting article:", error);
    throw error;
  }
};

// ==================== BULK OPERATIONS ====================

export const bulkUpdateStatus = async (
  type: "video" | "article",
  ids: string[],
  status: ContentStatus
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const collectionName = type === "video" ? "videos" : "articles";

    ids.forEach((id) => {
      const docRef = doc(db, collectionName, id);
      batch.update(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`Bulk status update completed for ${ids.length} ${type}s`);
  } catch (error) {
    console.error("Error in bulk status update:", error);
    throw error;
  }
};

export const bulkDelete = async (
  type: "video" | "article",
  ids: string[]
): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const collectionName = type === "video" ? "videos" : "articles";

    ids.forEach((id) => {
      const docRef = doc(db, collectionName, id);
      batch.delete(docRef);
    });

    await batch.commit();
    console.log(`Bulk delete completed for ${ids.length} ${type}s`);
  } catch (error) {
    console.error("Error in bulk delete:", error);
    throw error;
  }
};

// ==================== PUBLISHED CONTENT (for public pages) ====================

export const getPublishedVideos = async (): Promise<Video[]> => {
  try {
    const q = query(
      videosCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error("Error fetching published videos:", error);
    return [];
  }
};

export const getPublishedArticles = async (): Promise<Article[]> => {
  try {
    const q = query(
      articlesCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error("Error fetching published articles:", error);
    return [];
  }
};

// ==================== SITE SETTINGS ====================

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  enableNotifications: boolean;
  enableComments: boolean;
  moderateComments: boolean;
  requireApproval: boolean;
  defaultVideoStatus: string;
  defaultArticleStatus: string;
  updatedAt?: Date;
}

const DEFAULT_SETTINGS: SiteSettings = {
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
};

export const getSettings = async (): Promise<SiteSettings> => {
  try {
    const settingsRef = doc(db, "settings", "site");
    const settingsSnap = await getDoc(settingsRef);

    if (settingsSnap.exists()) {
      const data = settingsSnap.data();
      return {
        siteName: data.siteName || DEFAULT_SETTINGS.siteName,
        siteDescription:
          data.siteDescription || DEFAULT_SETTINGS.siteDescription,
        contactEmail: data.contactEmail || DEFAULT_SETTINGS.contactEmail,
        enableNotifications:
          data.enableNotifications ?? DEFAULT_SETTINGS.enableNotifications,
        enableComments: data.enableComments ?? DEFAULT_SETTINGS.enableComments,
        moderateComments:
          data.moderateComments ?? DEFAULT_SETTINGS.moderateComments,
        requireApproval:
          data.requireApproval ?? DEFAULT_SETTINGS.requireApproval,
        defaultVideoStatus:
          data.defaultVideoStatus || DEFAULT_SETTINGS.defaultVideoStatus,
        defaultArticleStatus:
          data.defaultArticleStatus || DEFAULT_SETTINGS.defaultArticleStatus,
        updatedAt: convertTimestamp(data.updatedAt),
      };
    }

    // Return defaults if no settings exist
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
};

export const updateSettings = async (
  settings: Partial<SiteSettings>
): Promise<void> => {
  try {
    const settingsRef = doc(db, "settings", "site");
    await setDoc(
      settingsRef,
      {
        ...settings,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Settings updated successfully");
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

// ==================== COURSES ====================

import type {
  Course,
  CourseCategory,
  CourseDifficulty,
  UserCourseProgress,
} from "@/types/admin";

export const coursesCollection = collection(db, "courses");
export const courseProgressCollection = collection(db, "courseProgress");

export const getCourses = async (): Promise<Course[]> => {
  try {
    const q = query(coursesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
        category: data.category as CourseCategory,
        difficulty: data.difficulty as CourseDifficulty,
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
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
};

export const getPublishedCourses = async (): Promise<Course[]> => {
  try {
    const q = query(
      coursesCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        thumbnailUrl: data.thumbnailUrl || "",
        category: data.category as CourseCategory,
        difficulty: data.difficulty as CourseDifficulty,
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
  } catch (error) {
    console.error("Error fetching published courses:", error);
    return [];
  }
};

export const getCourse = async (id: string): Promise<Course | null> => {
  try {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || "",
      description: data.description || "",
      thumbnailUrl: data.thumbnailUrl || "",
      category: data.category as CourseCategory,
      difficulty: data.difficulty as CourseDifficulty,
      lessons: data.lessons || [],
      totalDuration: data.totalDuration || "",
      enrolledCount: data.enrolledCount || 0,
      status: data.status as ContentStatus,
      tags: data.tags || [],
      author: data.author || "",
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
};

export const addCourse = async (
  course: Omit<Course, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(coursesCollection, {
      ...course,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Course added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

export const updateCourse = async (
  id: string,
  updates: Partial<Course>
): Promise<void> => {
  try {
    const docRef = doc(db, "courses", id);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...updateData } = updates;
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    console.log("Course updated:", id);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
    console.log("Course deleted:", id);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

// ==================== USER COURSE PROGRESS ====================

export const getUserCourseProgress = async (
  userId: string,
  courseId: string
): Promise<UserCourseProgress | null> => {
  try {
    const progressId = `${userId}_${courseId}`;
    const docRef = doc(db, "courseProgress", progressId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      odUserId: data.userId || userId,
      courseId: data.courseId || courseId,
      completedLessons: data.completedLessons || [],
      currentLessonId: data.currentLessonId || null,
      progressPercent: data.progressPercent || 0,
      startedAt: convertTimestamp(data.startedAt),
      lastAccessedAt: convertTimestamp(data.lastAccessedAt),
      completedAt: data.completedAt ? convertTimestamp(data.completedAt) : null,
    };
  } catch (error) {
    console.error("Error fetching user course progress:", error);
    return null;
  }
};

export const getAllUserCourseProgress = async (
  userId: string
): Promise<UserCourseProgress[]> => {
  try {
    const q = query(courseProgressCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
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
      };
    });
  } catch (error) {
    console.error("Error fetching all user course progress:", error);
    return [];
  }
};

export const startCourse = async (
  userId: string,
  courseId: string,
  firstLessonId: string
): Promise<void> => {
  try {
    const progressId = `${userId}_${courseId}`;
    const docRef = doc(db, "courseProgress", progressId);

    await setDoc(docRef, {
      userId,
      courseId,
      completedLessons: [],
      currentLessonId: firstLessonId,
      progressPercent: 0,
      startedAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
      completedAt: null,
    });

    // Increment enrolled count on the course
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      const currentCount = courseSnap.data().enrolledCount || 0;
      await updateDoc(courseRef, { enrolledCount: currentCount + 1 });
    }

    console.log("Course started:", progressId);
  } catch (error) {
    console.error("Error starting course:", error);
    throw error;
  }
};

export const completeLessonProgress = async (
  userId: string,
  courseId: string,
  lessonId: string,
  totalLessons: number,
  nextLessonId: string | null
): Promise<void> => {
  try {
    const progressId = `${userId}_${courseId}`;
    const docRef = doc(db, "courseProgress", progressId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Course progress not found");
    }

    const data = docSnap.data();
    const completedLessons: string[] = data.completedLessons || [];

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const progressPercent = Math.round(
      (completedLessons.length / totalLessons) * 100
    );
    const isCompleted = progressPercent >= 100;

    await updateDoc(docRef, {
      completedLessons,
      currentLessonId: nextLessonId,
      progressPercent,
      lastAccessedAt: serverTimestamp(),
      ...(isCompleted ? { completedAt: serverTimestamp() } : {}),
    });

    console.log("Lesson completed:", lessonId);
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw error;
  }
};

export const updateCurrentLesson = async (
  userId: string,
  courseId: string,
  lessonId: string
): Promise<void> => {
  try {
    const progressId = `${userId}_${courseId}`;
    const docRef = doc(db, "courseProgress", progressId);

    await updateDoc(docRef, {
      currentLessonId: lessonId,
      lastAccessedAt: serverTimestamp(),
    });

    console.log("Current lesson updated:", lessonId);
  } catch (error) {
    console.error("Error updating current lesson:", error);
    throw error;
  }
};

// ==================== STOCKS ====================

import type { Stock, StockStatus, StockSector } from "@/types/admin";

export const stocksCollection = collection(db, "stocks");

export const getStocks = async (): Promise<Stock[]> => {
  try {
    const q = query(stocksCollection, orderBy("dateAdded", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        ticker: data.ticker,
        sector: data.sector as StockSector,
        description: data.description,
        analysis: data.analysis || "",
        entryPrice: data.entryPrice,
        targetPrice: data.targetPrice,
        stopLoss: data.stopLoss,
        status: data.status as StockStatus,
        dateAdded: convertTimestamp(data.dateAdded),
        dateClosed: data.dateClosed ? convertTimestamp(data.dateClosed) : undefined,
        closingPrice: data.closingPrice,
        closingNotes: data.closingNotes,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Stock;
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    throw error;
  }
};

export const getActiveStocks = async (): Promise<Stock[]> => {
  try {
    const q = query(
      stocksCollection,
      where("status", "==", "active"),
      orderBy("dateAdded", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        ticker: data.ticker,
        sector: data.sector as StockSector,
        description: data.description,
        analysis: data.analysis || "",
        entryPrice: data.entryPrice,
        targetPrice: data.targetPrice,
        stopLoss: data.stopLoss,
        status: data.status as StockStatus,
        dateAdded: convertTimestamp(data.dateAdded),
        dateClosed: data.dateClosed ? convertTimestamp(data.dateClosed) : undefined,
        closingPrice: data.closingPrice,
        closingNotes: data.closingNotes,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Stock;
    });
  } catch (error) {
    console.error("Error fetching active stocks:", error);
    throw error;
  }
};

export const getStock = async (id: string): Promise<Stock | null> => {
  try {
    const docRef = doc(db, "stocks", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      ticker: data.ticker,
      sector: data.sector as StockSector,
      description: data.description,
      analysis: data.analysis || "",
      entryPrice: data.entryPrice,
      targetPrice: data.targetPrice,
      stopLoss: data.stopLoss,
      status: data.status as StockStatus,
      dateAdded: convertTimestamp(data.dateAdded),
      dateClosed: data.dateClosed ? convertTimestamp(data.dateClosed) : undefined,
      closingPrice: data.closingPrice,
      closingNotes: data.closingNotes,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Stock;
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }
};

export const addStock = async (
  stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    // Build the stock data, excluding undefined fields
    const stockData: Record<string, unknown> = {
      name: stock.name,
      ticker: stock.ticker,
      sector: stock.sector,
      description: stock.description || "",
      analysis: stock.analysis || "",
      entryPrice: stock.entryPrice,
      targetPrice: stock.targetPrice,
      stopLoss: stock.stopLoss,
      status: stock.status,
      dateAdded: stock.dateAdded instanceof Date ? Timestamp.fromDate(stock.dateAdded) : stock.dateAdded,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    // Only add optional fields if they have values
    if (stock.dateClosed) {
      stockData.dateClosed = stock.dateClosed instanceof Date ? Timestamp.fromDate(stock.dateClosed) : stock.dateClosed;
    }
    if (stock.closingPrice !== undefined) {
      stockData.closingPrice = stock.closingPrice;
    }
    if (stock.closingNotes) {
      stockData.closingNotes = stock.closingNotes;
    }
    
    const docRef = await addDoc(stocksCollection, stockData);
    console.log("Stock added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
};

export const updateStock = async (
  id: string,
  updates: Partial<Stock>
): Promise<void> => {
  try {
    const docRef = doc(db, "stocks", id);
    const updateData: Record<string, unknown> = {};
    
    // Only include defined values to avoid Firestore errors
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        updateData[key] = value;
      }
    });
    
    // Convert Date objects to Timestamps
    if (updates.dateAdded instanceof Date) {
      updateData.dateAdded = Timestamp.fromDate(updates.dateAdded);
    }
    if (updates.dateClosed instanceof Date) {
      updateData.dateClosed = Timestamp.fromDate(updates.dateClosed);
    }
    
    // Add updatedAt timestamp
    updateData.updatedAt = serverTimestamp();
    
    await updateDoc(docRef, updateData);
    console.log("Stock updated:", id);
  } catch (error) {
    console.error("Error updating stock:", error);
    throw error;
  }
};

export const deleteStock = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "stocks", id);
    await deleteDoc(docRef);
    console.log("Stock deleted:", id);
  } catch (error) {
    console.error("Error deleting stock:", error);
    throw error;
  }
};

// ==================== DISCUSSIONS ====================

export const discussionsCollection = collection(db, "discussions");

export const getDiscussions = async (): Promise<Discussion[]> => {
  try {
    const q = query(discussionsCollection, orderBy("lastActivityAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        content: data.content || "",
        category: data.category as DiscussionCategory,
        author: data.author as DiscussionAuthor,
        replies: (data.replies || []).map((reply: Record<string, unknown>) => ({
          ...reply,
          createdAt: convertTimestamp(reply.createdAt as Timestamp),
        })) as Reply[],
        replyCount: data.replyCount || 0,
        viewCount: data.viewCount || 0,
        pinned: data.pinned || false,
        hot: data.hot || false,
        status: (data.status || "open") as DiscussionStatus,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
        lastActivityAt: convertTimestamp(data.lastActivityAt),
      } as Discussion;
    });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    throw error;
  }
};

export const getDiscussion = async (id: string): Promise<Discussion | null> => {
  try {
    const docRef = doc(db, "discussions", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    
    // Increment view count
    await updateDoc(docRef, {
      viewCount: (data.viewCount || 0) + 1,
    });
    
    return {
      id: docSnap.id,
      title: data.title || "",
      content: data.content || "",
      category: data.category as DiscussionCategory,
      author: data.author as DiscussionAuthor,
      replies: (data.replies || []).map((reply: Record<string, unknown>) => ({
        ...reply,
        createdAt: convertTimestamp(reply.createdAt as Timestamp),
      })) as Reply[],
      replyCount: data.replyCount || 0,
      viewCount: (data.viewCount || 0) + 1,
      pinned: data.pinned || false,
      hot: data.hot || false,
      status: (data.status || "open") as DiscussionStatus,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
      lastActivityAt: convertTimestamp(data.lastActivityAt),
    } as Discussion;
  } catch (error) {
    console.error("Error fetching discussion:", error);
    throw error;
  }
};

export const addDiscussion = async (
  discussion: Omit<Discussion, "id" | "replies" | "replyCount" | "viewCount" | "pinned" | "hot" | "createdAt" | "updatedAt" | "lastActivityAt">
): Promise<string> => {
  try {
    const now = serverTimestamp();
    const docRef = await addDoc(discussionsCollection, {
      title: discussion.title,
      content: discussion.content,
      category: discussion.category,
      author: discussion.author,
      status: discussion.status || "open",
      replies: [],
      replyCount: 0,
      viewCount: 0,
      pinned: false,
      hot: false,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    });
    console.log("Discussion added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding discussion:", error);
    throw error;
  }
};

export const addReply = async (
  discussionId: string,
  reply: Omit<Reply, "id" | "createdAt">
): Promise<void> => {
  try {
    const docRef = doc(db, "discussions", discussionId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Discussion not found");
    }
    
    const data = docSnap.data();
    const existingReplies = data.replies || [];
    
    const newReply = {
      id: `reply_${Date.now()}`,
      content: reply.content,
      author: reply.author,
      createdAt: Timestamp.now(),
    };
    
    await updateDoc(docRef, {
      replies: [...existingReplies, newReply],
      replyCount: existingReplies.length + 1,
      lastActivityAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Mark as hot if more than 5 replies
      hot: existingReplies.length + 1 >= 5,
    });
    
    console.log("Reply added to discussion:", discussionId);
  } catch (error) {
    console.error("Error adding reply:", error);
    throw error;
  }
};

export const updateDiscussion = async (
  id: string,
  updates: Partial<Pick<Discussion, "status" | "pinned" | "hot">>
): Promise<void> => {
  try {
    const docRef = doc(db, "discussions", id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log("Discussion updated:", id);
  } catch (error) {
    console.error("Error updating discussion:", error);
    throw error;
  }
};

export const deleteDiscussion = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "discussions", id);
    await deleteDoc(docRef);
    console.log("Discussion deleted:", id);
  } catch (error) {
    console.error("Error deleting discussion:", error);
    throw error;
  }
};

// ==================== WEEKLY RECAPS ====================

export const weeklyRecapsCollection = collection(db, "weeklyRecaps");

export const getWeeklyRecaps = async (): Promise<WeeklyRecap[]> => {
  try {
    const q = query(weeklyRecapsCollection, orderBy("weekStartDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        weekStartDate: convertTimestamp(data.weekStartDate),
        weekEndDate: convertTimestamp(data.weekEndDate),
        content: data.content || "",
        highlights: data.highlights || [],
        status: (data.status || "draft") as ContentStatus,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as WeeklyRecap;
    });
  } catch (error) {
    console.error("Error fetching weekly recaps:", error);
    throw error;
  }
};

export const getPublishedWeeklyRecaps = async (): Promise<WeeklyRecap[]> => {
  try {
    const q = query(
      weeklyRecapsCollection,
      where("status", "==", "published"),
      orderBy("weekStartDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        weekStartDate: convertTimestamp(data.weekStartDate),
        weekEndDate: convertTimestamp(data.weekEndDate),
        content: data.content || "",
        highlights: data.highlights || [],
        status: data.status as ContentStatus,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as WeeklyRecap;
    });
  } catch (error) {
    console.error("Error fetching published weekly recaps:", error);
    throw error;
  }
};

export const getWeeklyRecap = async (id: string): Promise<WeeklyRecap | null> => {
  try {
    const docRef = doc(db, "weeklyRecaps", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || "",
      weekStartDate: convertTimestamp(data.weekStartDate),
      weekEndDate: convertTimestamp(data.weekEndDate),
      content: data.content || "",
      highlights: data.highlights || [],
      status: (data.status || "draft") as ContentStatus,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as WeeklyRecap;
  } catch (error) {
    console.error("Error fetching weekly recap:", error);
    throw error;
  }
};

export const addWeeklyRecap = async (
  recap: Omit<WeeklyRecap, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(weeklyRecapsCollection, {
      title: recap.title,
      weekStartDate: recap.weekStartDate instanceof Date ? Timestamp.fromDate(recap.weekStartDate) : recap.weekStartDate,
      weekEndDate: recap.weekEndDate instanceof Date ? Timestamp.fromDate(recap.weekEndDate) : recap.weekEndDate,
      content: recap.content,
      highlights: recap.highlights,
      status: recap.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log("Weekly recap added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding weekly recap:", error);
    throw error;
  }
};

export const updateWeeklyRecap = async (
  id: string,
  recap: Partial<Omit<WeeklyRecap, "id" | "createdAt" | "updatedAt">>
): Promise<void> => {
  try {
    const docRef = doc(db, "weeklyRecaps", id);
    const updateData: Record<string, unknown> = {
      ...recap,
      updatedAt: serverTimestamp(),
    };
    
    if (recap.weekStartDate instanceof Date) {
      updateData.weekStartDate = Timestamp.fromDate(recap.weekStartDate);
    }
    if (recap.weekEndDate instanceof Date) {
      updateData.weekEndDate = Timestamp.fromDate(recap.weekEndDate);
    }
    
    await updateDoc(docRef, updateData);
    console.log("Weekly recap updated:", id);
  } catch (error) {
    console.error("Error updating weekly recap:", error);
    throw error;
  }
};

export const deleteWeeklyRecap = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "weeklyRecaps", id);
    await deleteDoc(docRef);
    console.log("Weekly recap deleted:", id);
  } catch (error) {
    console.error("Error deleting weekly recap:", error);
    throw error;
  }
};
