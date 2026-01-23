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
  Stock,
  ContentStatus,
  VideoCategory,
  ArticleCategory,
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

// ==================== STOCKS ====================

export const stocksCollection = collection(db, "stocks");

export const getStocks = async (): Promise<Stock[]> => {
  try {
    const q = query(stocksCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        ticker: data.ticker || "",
        sector: data.sector as StockSector,
        market: data.market || "US",
        status: data.status as StockStatus,
        analysis: data.analysis || [],
        highlights: data.highlights || [],
        tradeSetup: data.tradeSetup || {
          buyRange: "",
          targetProfit: "",
          riskPrice: "",
        },
        author: data.author || "",
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      };
    });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return [];
  }
};

export const getStock = async (id: string): Promise<Stock | null> => {
  try {
    const docRef = doc(db, "stocks", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || "",
      ticker: data.ticker || "",
      market: data.market || "US",
      sector: data.sector as StockSector,
      status: data.status as StockStatus,
      analysis: data.analysis || [],
      highlights: data.highlights || [],
      tradeSetup: data.tradeSetup || {
        buyRange: "",
        targetProfit: "",
        riskPrice: "",
      },
      author: data.author || "",
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching stock:", error);
    return null;
  }
};

export const getStockByTicker = async (
  ticker: string
): Promise<Stock | null> => {
  try {
    const q = query(
      stocksCollection,
      where("ticker", "==", ticker.toUpperCase())
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name || "",
      ticker: data.ticker || "",
      market: data.market || "US",
      sector: data.sector as StockSector,
      status: data.status as StockStatus,
      analysis: data.analysis || [],
      highlights: data.highlights || [],
      tradeSetup: data.tradeSetup || {
        buyRange: "",
        targetProfit: "",
        riskPrice: "",
      },
      author: data.author || "",
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    };
  } catch (error) {
    console.error("Error fetching stock by ticker:", error);
    return null;
  }
};

export const addStock = async (
  stock: Omit<Stock, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const docRef = await addDoc(stocksCollection, {
      ...stock,
      ticker: stock.ticker.toUpperCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt: _createdAt, ...updateData } = updates;
    await updateDoc(docRef, {
      ...updateData,
      ...(updates.ticker ? { ticker: updates.ticker.toUpperCase() } : {}),
      updatedAt: serverTimestamp(),
    });
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

export const getPublishedStocks = async (): Promise<Stock[]> => {
  try {
    const q = query(
      stocksCollection,
      where("status", "in", ["active", "watchlist"]),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        ticker: data.ticker || "",
        market: data.market || "US",
        sector: data.sector as StockSector,
        status: data.status as StockStatus,
        analysis: data.analysis || [],
        highlights: data.highlights || [],
        tradeSetup: data.tradeSetup || {
          buyRange: "",
          targetProfit: "",
          riskPrice: "",
        },
        author: data.author || "",
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      };
    });
  } catch (error) {
    console.error("Error fetching published stocks:", error);
    return [];
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
