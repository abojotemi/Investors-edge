import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
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
