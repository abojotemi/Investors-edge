"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/context/auth-context";
import {
  getVideos,
  addVideo as createVideo,
  updateVideo as modifyVideo,
  deleteVideo as removeVideo,
  getArticles,
  addArticle as createArticle,
  updateArticle as modifyArticle,
  deleteArticle as removeArticle,
  getStocks,
  addStock as createStock,
  updateStock as modifyStock,
  deleteStock as removeStock,
  bulkUpdateStatus as updateStatusBulk,
  bulkDelete as deleteBulk,
} from "@/lib/firebase/firestore";
import type {
  Video,
  Article,
  Stock,
  AdminUser,
  DashboardStats,
  ContentStatus,
} from "@/types/admin";

interface AdminContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminLoading: boolean;
  adminUser: AdminUser | null;
  videos: Video[];
  articles: Article[];
  stocks: Stock[];
  stats: DashboardStats;
  loading: boolean;
  // Video operations
  addVideo: (
    video: Omit<Video, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateVideo: (id: string, video: Partial<Video>) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  getVideo: (id: string) => Video | undefined;
  // Article operations
  addArticle: (
    article: Omit<Article, "id" | "createdAt" | "updatedAt" | "slug">
  ) => Promise<void>;
  updateArticle: (id: string, article: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  getArticle: (id: string) => Article | undefined;
  // Stock operations
  addStock: (
    stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateStock: (id: string, stock: Partial<Stock>) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
  getStock: (id: string) => Stock | undefined;
  // Bulk operations
  bulkUpdateStatus: (
    type: "video" | "article",
    ids: string[],
    status: ContentStatus
  ) => Promise<void>;
  bulkDelete: (type: "video" | "article", ids: string[]) => Promise<void>;
  // Refresh data
  refreshVideos: () => Promise<void>;
  refreshArticles: () => Promise<void>;
  refreshStocks: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const {
    user,
    userProfile,
    loading: authLoading,
    isAdmin: authIsAdmin,
    isSuperAdmin: authIsSuperAdmin,
  } = useAuth();
  const [dataLoading, setDataLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);

  // Derive admin state from auth context using useMemo to avoid unnecessary re-renders
  const isAdmin = useMemo(
    () => !authLoading && authIsAdmin,
    [authLoading, authIsAdmin]
  );
  const isSuperAdmin = useMemo(
    () => !authLoading && authIsSuperAdmin,
    [authLoading, authIsSuperAdmin]
  );
  const adminLoading = authLoading;

  // Derive admin user from auth data
  const adminUser = useMemo<AdminUser | null>(() => {
    if (!authLoading && user && userProfile && authIsAdmin) {
      return {
        uid: user.uid,
        email: user.email || "",
        displayName: userProfile.displayName || "Admin",
        photoURL: user.photoURL,
        role: userProfile.role,
      };
    }
    return null;
  }, [authLoading, user, userProfile, authIsAdmin]);

  // Fetch videos from Firestore
  const refreshVideos = useCallback(async () => {
    try {
      const fetchedVideos = await getVideos();
      setVideos(fetchedVideos);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  }, []);

  // Fetch articles from Firestore
  const refreshArticles = useCallback(async () => {
    try {
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }, []);

  // Fetch stocks from Firestore
  const refreshStocks = useCallback(async () => {
    try {
      const fetchedStocks = await getStocks();
      setStocks(fetchedStocks);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  }, []);

  // Initial data fetch - using IIFE pattern to avoid lint warnings
  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!authLoading && isAdmin) {
        setDataLoading(true);
        await Promise.all([
          refreshVideos(),
          refreshArticles(),
          refreshStocks(),
        ]);
        if (isMounted) {
          setDataLoading(false);
        }
      } else if (!authLoading && isMounted) {
        setDataLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [authLoading, isAdmin, refreshVideos, refreshArticles, refreshStocks]);

  // Combine loading states
  const loading = authLoading || dataLoading;

  // Calculate stats
  const stats: DashboardStats = {
    totalVideos: videos.length,
    totalArticles: articles.length,
    totalStocks: stocks.length,
    publishedContent:
      videos.filter((v) => v.status === "published").length +
      articles.filter((a) => a.status === "published").length,
    draftContent:
      videos.filter((v) => v.status === "draft").length +
      articles.filter((a) => a.status === "draft").length,
  };

  // Video operations
  const addVideo = async (
    video: Omit<Video, "id" | "createdAt" | "updatedAt">
  ) => {
    await createVideo(video);
    await refreshVideos();
  };

  const updateVideo = async (id: string, updates: Partial<Video>) => {
    await modifyVideo(id, updates);
    await refreshVideos();
  };

  const deleteVideo = async (id: string) => {
    await removeVideo(id);
    await refreshVideos();
  };

  const getVideo = (id: string) => {
    return videos.find((video) => video.id === id);
  };

  // Article operations
  const addArticle = async (
    article: Omit<Article, "id" | "createdAt" | "updatedAt" | "slug">
  ) => {
    await createArticle(article);
    await refreshArticles();
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    await modifyArticle(id, updates);
    await refreshArticles();
  };

  const deleteArticle = async (id: string) => {
    await removeArticle(id);
    await refreshArticles();
  };

  const getArticle = (id: string) => {
    return articles.find((article) => article.id === id);
  };

  // Stock operations
  const addStock = async (
    stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
  ) => {
    await createStock(stock);
    await refreshStocks();
  };

  const updateStock = async (id: string, updates: Partial<Stock>) => {
    await modifyStock(id, updates);
    await refreshStocks();
  };

  const deleteStock = async (id: string) => {
    await removeStock(id);
    await refreshStocks();
  };

  const getStock = (id: string) => {
    return stocks.find((stock) => stock.id === id);
  };

  // Bulk operations
  const bulkUpdateStatus = async (
    type: "video" | "article",
    ids: string[],
    status: ContentStatus
  ) => {
    await updateStatusBulk(type, ids, status);
    if (type === "video") {
      await refreshVideos();
    } else {
      await refreshArticles();
    }
  };

  const bulkDelete = async (type: "video" | "article", ids: string[]) => {
    await deleteBulk(type, ids);
    if (type === "video") {
      await refreshVideos();
    } else {
      await refreshArticles();
    }
  };

  const value: AdminContextType = {
    isAdmin,
    isSuperAdmin,
    adminLoading,
    adminUser,
    videos,
    articles,
    stocks,
    stats,
    loading,
    addVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    addArticle,
    updateArticle,
    deleteArticle,
    getArticle,
    addStock,
    updateStock,
    deleteStock,
    getStock,
    bulkUpdateStatus,
    bulkDelete,
    refreshVideos,
    refreshArticles,
    refreshStocks,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};
