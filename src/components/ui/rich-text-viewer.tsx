"use client";

import { cn } from "@/lib/utils";

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export function RichTextViewer({ content, className }: RichTextViewerProps) {
  if (!content || content === "<p></p>") {
    return null;
  }

  return (
    <article
      className={cn(
        // Base typography
        "prose prose-lg max-w-none",
        // Headings
        "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-foreground",
        "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-foreground",
        "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-foreground",
        // Paragraphs
        "[&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4 [&_p]:text-foreground/90",
        // Lists
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2",
        "[&_li]:text-foreground/90",
        // Blockquotes - Medium style
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-green [&_blockquote]:pl-6 [&_blockquote]:py-1 [&_blockquote]:my-6",
        "[&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:bg-muted/30 [&_blockquote]:rounded-r-lg",
        // Code
        "[&_pre]:bg-slate-900 [&_pre]:text-slate-50 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4",
        "[&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono",
        // Links
        "[&_a]:text-primary-green [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary-green/80",
        // Images
        "[&_img]:rounded-xl [&_img]:shadow-lg [&_img]:my-6 [&_img]:max-w-full [&_img]:mx-auto",
        // Horizontal Rule
        "[&_hr]:my-8 [&_hr]:border-border",
        // YouTube embeds
        "[&_iframe]:rounded-xl [&_iframe]:shadow-lg [&_iframe]:my-6 [&_iframe]:max-w-full [&_iframe]:mx-auto",
        "[&_.youtube-embed]:aspect-video [&_.youtube-embed]:w-full",
        className
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

export default RichTextViewer;
