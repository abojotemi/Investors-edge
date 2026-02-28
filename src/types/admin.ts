// Admin Types

export type UserRole = "user" | "admin";

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
  totalCourses: number;
  publishedContent: number;
  draftContent: number;
}

// ==================== COURSES ====================

export type CourseCategory =
  | "investing-basics"
  | "stock-analysis"
  | "portfolio-management"
  | "trading-strategies"
  | "financial-planning"
  | "crypto";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export interface CourseLesson {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "10 min"
  videoUrl?: string;
  content?: string; // Rich text content for reading materials
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  lessons: CourseLesson[];
  totalDuration: string; // e.g., "2h 30min"
  enrolledCount: number;
  status: ContentStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface UserCourseProgress {
  id: string;
  odUserId: string;
  courseId: string;
  completedLessons: string[]; // Array of lesson IDs that are completed
  currentLessonId: string | null;
  progressPercent: number; // 0-100
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt: Date | null;
}

export type StockStatus = "active" | "closed";
export type StockSector =
  | "technology"
  | "healthcare"
  | "finance"
  | "energy"
  | "consumer"
  | "industrial"
  | "materials"
  | "utilities"
  | "real-estate"
  | "communication";

export interface Stock {
  id: string;
  name: string;
  ticker: string;
  sector: StockSector;
  description: string;
  analysis: string; // Rich text analysis
  entryPrice: number;
  targetPrice: number;
  stopLoss: number;
  status: StockStatus;
  dateAdded: Date;
  dateClosed?: Date;
  closingPrice?: number;
  closingNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Discussion types
export type DiscussionCategory = 
  | "beginner"
  | "stocks"
  | "real-estate"
  | "crypto"
  | "retirement"
  | "strategies";

export type DiscussionStatus = "open" | "closed" | "resolved";

export interface DiscussionAuthor {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface Reply {
  id: string;
  content: string;
  author: DiscussionAuthor;
  createdAt: Date;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  category: DiscussionCategory;
  author: DiscussionAuthor;
  replies: Reply[];
  replyCount: number;
  viewCount: number;
  pinned: boolean;
  hot: boolean;
  status: DiscussionStatus;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
}

// Weekly Recap types
export interface WeeklyRecap {
  id: string;
  title: string;
  weekStartDate: Date;
  weekEndDate: Date;
  content: string; // Rich text content
  highlights: string[]; // Key highlights of the week
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Sector Watch types
export type SectorTrend = "up" | "down" | "neutral";

export interface SectorWatch {
  id: string;
  name: string;
  trend: SectorTrend;
  performance: string; // e.g. "+3.2%" or "-1.8%"
  outlook: string;
  content: string; // Rich-text article body
  topPicks: string[]; // ticker symbols
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}
