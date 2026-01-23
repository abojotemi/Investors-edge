"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Tag,
  User,
  FileText,
  Loader2,
  Share2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import BackgroundCircles from "@/components/ui/background-circles";
import { useContent } from "@/context/content-context";
import { getArticleBySlug } from "@/lib/firebase/firestore";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/admin";

const categoryColors: Record<string, string> = {
  "investing-basics": "bg-primary-green text-white",
  "market-news": "bg-blue-500 text-white",
  strategies: "bg-primary-orange text-white",
  "personal-finance": "bg-teal-500 text-white",
  crypto: "bg-yellow-500 text-black",
  "real-estate": "bg-amber-600 text-white",
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const articleSlug = params.slug as string;
  const { articles, loading: contentLoading } = useContent();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      // First try to get from context (faster if already loaded)
      const articleFromContext = articles.find((a) => a.slug === articleSlug);
      if (articleFromContext) {
        setArticle(articleFromContext);
        setLoading(false);
        return;
      }

      // If content is still loading, wait
      if (contentLoading) {
        return;
      }

      // If content is loaded but article not found, fetch directly from Firebase
      try {
        const articleFromFirebase = await getArticleBySlug(articleSlug);
        if (articleFromFirebase && articleFromFirebase.status === "published") {
          setArticle(articleFromFirebase);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching article:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [articleSlug, articles, contentLoading]);

  // Get related articles (same category, excluding current)
  const relatedArticles = articles
    .filter((a) => a.slug !== articleSlug && a.category === article?.category)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Check if content is HTML (from rich text editor) or plain text/markdown
  const isHtmlContent = (content: string) => {
    // Check for common HTML tags
    return /<[a-z][\s\S]*>/i.test(content);
  };

  // Render content - handles both HTML and legacy markdown
  const renderContent = (content: string) => {
    // If content contains HTML tags, render as HTML directly
    if (isHtmlContent(content)) {
      return (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Legacy: Parse markdown-like content
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((paragraph, index) => {
      // Check for headings (## or ###)
      if (paragraph.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg font-bold mt-6 mb-3 text-foreground"
          >
            {paragraph.replace("### ", "")}
          </h3>
        );
      }
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-xl font-bold mt-8 mb-4 text-foreground"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }

      // Check for bullet points
      if (paragraph.includes("\n- ") || paragraph.startsWith("- ")) {
        const items = paragraph.split("\n").filter((line) => line.trim());
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item.replace(/^- /, "")}
              </li>
            ))}
          </ul>
        );
      }

      // Check for numbered lists
      if (/^\d+\.\s/.test(paragraph)) {
        const items = paragraph.split("\n").filter((line) => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4">
            {items.map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item.replace(/^\d+\.\s/, "")}
              </li>
            ))}
          </ol>
        );
      }

      // Regular paragraph
      return (
        <p
          key={index}
          className="text-muted-foreground leading-relaxed mb-4"
          dangerouslySetInnerHTML={{
            __html: paragraph
              // Bold text
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              // Italic text
              .replace(/\*(.*?)\*/g, "<em>$1</em>")
              // Links
              .replace(
                /\[(.*?)\]\((.*?)\)/g,
                '<a href="$2" class="text-primary-green hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
              ),
          }}
        />
      );
    });
  };

  if (loading || contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Article Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The article you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button
            onClick={() => router.push("/learn")}
            className="bg-primary-green hover:bg-primary-green/90"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Learning Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden relative flex flex-col">
      <BackgroundCircles variant="dense" />

      <section className="relative py-6 sm:py-8 md:py-12 px-4 bg-gradient-to-br from-primary-peach/10 via-background to-primary-green/10 flex-1">
        <div className="relative container mx-auto max-w-6xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Learning Hub</span>
            </Link>
          </motion.div>

          {/* Featured Image */}
          {article.featuredImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-[21/9]"
            >
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Article Header */}
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-border/50">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1.5 rounded-full capitalize",
                      categoryColors[article.category] ||
                        "bg-primary-green text-white"
                    )}
                  >
                    {article.category.replace("-", " ")}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border/50">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic border-l-4 border-primary-green pl-4">
                  {article.excerpt}
                </p>

                {/* Article Content */}
                <div
                  className={cn(
                    "prose prose-gray max-w-none",
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-foreground",
                    "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-foreground",
                    "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-foreground",
                    "[&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-muted-foreground",
                    "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4",
                    "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4",
                    "[&_li]:mb-1 [&_li]:text-muted-foreground",
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-green [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_blockquote]:text-muted-foreground",
                    "[&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4",
                    "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-sm",
                    "[&_a]:text-primary-green [&_a]:underline [&_a]:hover:text-primary-green/80",
                    "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4",
                    "[&_strong]:font-bold [&_strong]:text-foreground",
                    "[&_em]:italic"
                  )}
                >
                  {renderContent(article.content)}
                </div>

                {/* Tags */}
                {article.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 pt-6 border-t border-border/50 flex gap-3">
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Article
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Author Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
                <h3 className="font-bold text-lg mb-4">About the Author</h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-green/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {article.author}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Content Writer
                    </p>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-border/50">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary-green" />
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        href={`/learn/articles/${relatedArticle.slug}`}
                        className="group block"
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary-green/20 to-primary-orange/10 relative">
                            {relatedArticle.featuredImage ? (
                              <img
                                src={relatedArticle.featuredImage}
                                alt={relatedArticle.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="w-6 h-6 text-primary-green/50" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary-green transition-colors">
                              {relatedArticle.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedArticle.readTime}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Learning Hub Card */}
              <div className="bg-gradient-to-br from-primary-green/10 to-primary-orange/10 rounded-2xl p-6 border border-primary-green/20">
                <h3 className="font-bold text-lg mb-2">Explore More Content</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover more videos, articles, and resources in our Learning
                  Hub.
                </p>
                <Button
                  onClick={() => router.push("/learn")}
                  className="w-full bg-primary-green hover:bg-primary-green/90"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learning Hub
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
