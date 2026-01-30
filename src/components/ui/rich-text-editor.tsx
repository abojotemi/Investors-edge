"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Eye,
  Edit3,
  Columns,
  Upload,
  X,
  Loader2,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadFileWithProgress } from "@/lib/firebase/storage";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

type ViewMode = "edit" | "preview" | "split";

interface ToolbarButton {
  icon: React.ReactNode;
  command: string;
  arg?: string;
  title: string;
  type?: "command" | "custom";
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your content...",
  error = false,
  className,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Update content when value changes externally (e.g., loading article)
  useEffect(() => {
    if (
      editorRef.current &&
      isInitialized &&
      value !== editorRef.current.innerHTML
    ) {
      // Only update if the content is different and we're not currently editing
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value, isInitialized]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  const execCommand = useCallback(
    (command: string, arg?: string) => {
      document.execCommand(command, false, arg);
      editorRef.current?.focus();
      handleContentChange();
    },
    [handleContentChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Handle keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            execCommand("bold");
            break;
          case "i":
            e.preventDefault();
            execCommand("italic");
            break;
          case "u":
            e.preventDefault();
            execCommand("underline");
            break;
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              execCommand("redo");
            } else {
              e.preventDefault();
              execCommand("undo");
            }
            break;
          case "y":
            e.preventDefault();
            execCommand("redo");
            break;
        }
      }
    },
    [execCommand]
  );

  const insertLink = useCallback(() => {
    if (linkUrl) {
      const text = linkText || linkUrl;
      const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary-green hover:underline">${text}</a>`;
      execCommand("insertHTML", linkHtml);
    }
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  }, [linkUrl, linkText, execCommand]);

  const insertImage = useCallback(() => {
    if (imageUrl) {
      // Convert Google Drive sharing URL to direct embed URL
      let finalUrl = imageUrl;
      
      // Handle Google Drive links
      // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
      // Convert to: https://drive.google.com/uc?export=view&id=FILE_ID
      const driveMatch = imageUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (driveMatch) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
      }
      
      // Handle Google Drive open links
      // Format: https://drive.google.com/open?id=FILE_ID
      const driveOpenMatch = imageUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
      if (driveOpenMatch) {
        finalUrl = `https://drive.google.com/uc?export=view&id=${driveOpenMatch[1]}`;
      }
      
      const imgHtml = `<img src="${finalUrl}" alt="Article image" class="max-w-full h-auto rounded-lg my-4" />`;
      execCommand("insertHTML", imgHtml);
    }
    setShowImageModal(false);
    setImageUrl("");
  }, [imageUrl, execCommand]);

  const insertVideo = useCallback(() => {
    if (videoUrl) {
      let embedHtml = "";
      
      // Handle Vimeo URLs
      // Format: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      if (vimeoMatch) {
        embedHtml = `<div class="aspect-video my-4"><iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" class="w-full h-full rounded-lg" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      
      // Handle YouTube URLs as fallback
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
      if (youtubeMatch) {
        embedHtml = `<div class="aspect-video my-4"><iframe src="https://www.youtube.com/embed/${youtubeMatch[1]}" class="w-full h-full rounded-lg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
      }
      
      if (embedHtml) {
        execCommand("insertHTML", embedHtml);
      } else {
        toast.error("Invalid video URL", {
          description: "Please enter a valid Vimeo or YouTube URL.",
        });
        return;
      }
    }
    setShowVideoModal(false);
    setVideoUrl("");
  }, [videoUrl, execCommand]);

  const handleImageUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please upload an image file.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "Maximum file size is 5MB.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const url = await uploadFileWithProgress(file, "images", (progress) =>
        setUploadProgress(progress)
      );
      setImageUrl(url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      // Handle pasted images
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            e.preventDefault();
            const file = items[i].getAsFile();
            if (file) {
              handleImageUpload(file);
            }
            return;
          }
        }
      }
    },
    [handleImageUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
          handleImageUpload(file);
        }
      }
    },
    [handleImageUpload]
  );

  const toolbarGroups: ToolbarButton[][] = [
    // History
    [
      {
        icon: <Undo className="w-4 h-4" />,
        command: "undo",
        title: "Undo (Ctrl+Z)",
      },
      {
        icon: <Redo className="w-4 h-4" />,
        command: "redo",
        title: "Redo (Ctrl+Y)",
      },
    ],
    // Headings
    [
      {
        icon: <Heading1 className="w-4 h-4" />,
        command: "formatBlock",
        arg: "h1",
        title: "Heading 1",
      },
      {
        icon: <Heading2 className="w-4 h-4" />,
        command: "formatBlock",
        arg: "h2",
        title: "Heading 2",
      },
      {
        icon: <Heading3 className="w-4 h-4" />,
        command: "formatBlock",
        arg: "h3",
        title: "Heading 3",
      },
    ],
    // Text formatting
    [
      {
        icon: <Bold className="w-4 h-4" />,
        command: "bold",
        title: "Bold (Ctrl+B)",
      },
      {
        icon: <Italic className="w-4 h-4" />,
        command: "italic",
        title: "Italic (Ctrl+I)",
      },
      {
        icon: <Underline className="w-4 h-4" />,
        command: "underline",
        title: "Underline (Ctrl+U)",
      },
      {
        icon: <Strikethrough className="w-4 h-4" />,
        command: "strikeThrough",
        title: "Strikethrough",
      },
    ],
    // Lists
    [
      {
        icon: <List className="w-4 h-4" />,
        command: "insertUnorderedList",
        title: "Bullet List",
      },
      {
        icon: <ListOrdered className="w-4 h-4" />,
        command: "insertOrderedList",
        title: "Numbered List",
      },
      {
        icon: <Quote className="w-4 h-4" />,
        command: "formatBlock",
        arg: "blockquote",
        title: "Quote",
      },
      {
        icon: <Code className="w-4 h-4" />,
        command: "formatBlock",
        arg: "pre",
        title: "Code Block",
      },
    ],
    // Alignment
    [
      {
        icon: <AlignLeft className="w-4 h-4" />,
        command: "justifyLeft",
        title: "Align Left",
      },
      {
        icon: <AlignCenter className="w-4 h-4" />,
        command: "justifyCenter",
        title: "Align Center",
      },
      {
        icon: <AlignRight className="w-4 h-4" />,
        command: "justifyRight",
        title: "Align Right",
      },
    ],
    // Media
    [
      {
        icon: <LinkIcon className="w-4 h-4" />,
        command: "link",
        title: "Insert Link",
        type: "custom",
      },
      {
        icon: <ImageIcon className="w-4 h-4" />,
        command: "image",
        title: "Insert Image (Google Drive supported)",
        type: "custom",
      },
      {
        icon: <Video className="w-4 h-4" />,
        command: "video",
        title: "Embed Video (Vimeo/YouTube)",
        type: "custom",
      },
    ],
  ];

  const handleToolbarClick = (button: ToolbarButton) => {
    if (button.type === "custom") {
      if (button.command === "link") {
        // Get selected text for link
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          setLinkText(selection.toString());
        }
        setShowLinkModal(true);
      } else if (button.command === "image") {
        setShowImageModal(true);
      } else if (button.command === "video") {
        setShowVideoModal(true);
      }
    } else {
      execCommand(button.command, button.arg);
    }
  };

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden",
        error ? "border-red-300" : "border-gray-200",
        className
      )}
    >
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Tool buttons */}
          {toolbarGroups.map((group, groupIndex) => (
            <React.Fragment key={groupIndex}>
              {groupIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-1" />}
              {group.map((button, buttonIndex) => (
                <button
                  key={buttonIndex}
                  type="button"
                  onClick={() => handleToolbarClick(button)}
                  className="p-2 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded transition-colors"
                  title={button.title}
                >
                  {button.icon}
                </button>
              ))}
            </React.Fragment>
          ))}

          {/* View mode toggles */}
          <div className="ml-auto flex items-center gap-1 border-l border-gray-300 pl-2">
            <button
              type="button"
              onClick={() => setViewMode("edit")}
              className={cn(
                "p-2 rounded transition-colors flex items-center gap-1 text-sm",
                viewMode === "edit"
                  ? "bg-primary-green text-white"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              title="Edit mode"
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={cn(
                "p-2 rounded transition-colors flex items-center gap-1 text-sm",
                viewMode === "split"
                  ? "bg-primary-green text-white"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              title="Split view"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={cn(
                "p-2 rounded transition-colors flex items-center gap-1 text-sm",
                viewMode === "preview"
                  ? "bg-primary-green text-white"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              title="Preview mode"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className={cn(
          "bg-white",
          viewMode === "split"
            ? "grid grid-cols-2 divide-x divide-gray-200"
            : ""
        )}
      >
        {/* Editor */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className={cn(
              "min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-primary-green/20",
              "prose prose-gray max-w-none",
              "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
              "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5",
              "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4",
              "[&_p]:mb-4 [&_p]:leading-relaxed",
              "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4",
              "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4",
              "[&_li]:mb-1",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-green [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
              "[&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4",
              "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded",
              "[&_a]:text-primary-green [&_a]:underline",
              "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4"
            )}
            data-placeholder={placeholder}
            style={{
              minHeight: "400px",
            }}
          />
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div
            className={cn(
              "min-h-[400px] p-4 bg-gray-50 overflow-auto",
              "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6",
              "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5",
              "[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4",
              "[&_p]:mb-4 [&_p]:leading-relaxed",
              "[&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4",
              "[&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4",
              "[&_li]:mb-1",
              "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-green [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
              "[&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4",
              "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded",
              "[&_a]:text-primary-green [&_a]:underline",
              "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4"
            )}
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value }} />
            ) : (
              <p className="text-gray-400 italic">
                Preview will appear here...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Empty state styling */}
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Link Modal */}
      {showLinkModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowLinkModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Insert Link
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL *
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Text (optional)
                  </label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Click here"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowLinkModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={insertLink}
                    disabled={!linkUrl}
                    className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50"
                  >
                    Insert Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => !isUploading && setShowImageModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Insert Image
                </h3>
                <button
                  type="button"
                  onClick={() => !isUploading && setShowImageModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  disabled={isUploading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {/* Upload option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-green transition-colors">
                    {isUploading ? (
                      <div className="space-y-2">
                        <Loader2 className="w-8 h-8 text-primary-green animate-spin mx-auto" />
                        <p className="text-sm text-gray-600">
                          Uploading... {uploadProgress}%
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-green h-2 rounded-full transition-all"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop an image, or
                        </p>
                        <label className="inline-block px-4 py-2 bg-primary-green text-white rounded-lg cursor-pointer hover:bg-primary-green/90">
                          Browse Files
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* URL option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                    disabled={isUploading}
                  />
                </div>

                {/* Preview */}
                {imageUrl && (
                  <div className="border border-gray-200 rounded-lg p-2">
                    <p className="text-xs text-gray-500 mb-2">Preview:</p>
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="max-h-32 mx-auto rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowImageModal(false);
                      setImageUrl("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    disabled={isUploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={insertImage}
                    disabled={!imageUrl || isUploading}
                    className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50"
                  >
                    Insert Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowVideoModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Embed Video
                </h3>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL *
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://vimeo.com/123456789"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports Vimeo and YouTube URLs
                  </p>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVideoModal(false);
                      setVideoUrl("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={insertVideo}
                    disabled={!videoUrl}
                    className="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-primary-green/90 disabled:opacity-50"
                  >
                    Embed Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RichTextEditor;
