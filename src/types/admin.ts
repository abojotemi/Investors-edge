// Admin Types

export type UserRole = "user" | "admin" | "super_admin";

export type ExperienceLevel =
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Expert";
export type RiskTolerance = "Conservative" | "Moderate" | "Aggressive";
export type InvestmentGoal =
  | "Long-term Growth"
  | "Income Generation"
  | "Capital Preservation"
  | "Speculation"
  | "Retirement";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
  bio?: string;
  experienceLevel?: ExperienceLevel;
  riskTolerance?: RiskTolerance;
  investmentGoal?: InvestmentGoal;
  preferredSectors?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: VideoCategory;
  tags: string[];
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: ArticleCategory;
  tags: string[];
  status: ContentStatus;
  readTime: string;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export type ContentStatus = "draft" | "published" | "archived";

export type VideoCategory =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "market-analysis"
  | "tutorials"
  | "webinars";

export type ArticleCategory =
  | "investing-basics"
  | "market-news"
  | "strategies"
  | "personal-finance"
  | "crypto"
  | "real-estate";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: UserRole;
}

export interface DashboardStats {
  totalVideos: number;
  totalArticles: number;
  totalStocks: number;
  publishedContent: number;
  draftContent: number;
}

// Stock Types
export type StockStatus = "active" | "watchlist" | "closed";
export type StockMarket = "US" | "NGX"; // US stocks or Nigerian Stock Exchange

export type StockSector =
  | "banking"
  | "insurance"
  | "construction"
  | "industrial-goods"
  | "consumer-goods"
  | "oil-gas"
  | "technology"
  | "agriculture"
  | "healthcare"
  | "real-estate"
  | "other";

export interface StockHighlight {
  title: string;
  description: string;
  icon: "check" | "down" | "up";
}

export interface StockTradeSetup {
  buyRange: string;
  targetProfit: string;
  riskPrice: string;
}

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  market: StockMarket;
  sector: StockSector;
  status: StockStatus;
  analysis: string[];
  highlights: StockHighlight[];
  tradeSetup: StockTradeSetup;
  createdAt: Date;
  updatedAt: Date;
  author: string;
}
