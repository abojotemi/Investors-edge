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
import type {
  Video,
  Article,
  VideoCategory,
  ArticleCategory,
  ContentStatus,
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
  loading: boolean;
  error: string | null;
  // Filtered content by category
  getVideosByCategory: (category: VideoCategory) => Video[];
  getArticlesByCategory: (category: ArticleCategory) => Article[];
  // Search functionality
  searchVideos: (query: string) => Video[];
  searchArticles: (query: string) => Article[];
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
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Combined loading state - only false when both are loaded
  const loading = videosLoading || articlesLoading;

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

  const value: ContentContextType = {
    videos,
    articles,
    loading,
    error,
    getVideosByCategory,
    getArticlesByCategory,
    searchVideos,
    searchArticles,
  };

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};
