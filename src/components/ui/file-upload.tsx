"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Video } from "lucide-react";
import {
  uploadFileWithProgress,
  validateFileSize,
  getMaxFileSize,
  getAllowedFileTypes,
  UploadType,
} from "@/lib/firebase/storage";
import { toast } from "sonner";

interface FileUploadProps {
  type: UploadType;
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
  className?: string;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  type,
  onUploadComplete,
  currentUrl,
  className = "",
  label,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = type === "thumbnails" || type === "images";
  const maxSize = getMaxFileSize(type);
  const allowedTypes = getAllowedFileTypes(type);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (!validateFileSize(file, maxSize)) {
      toast.error("File too large", {
        description: `Maximum file size is ${maxSize}MB`,
      });
      return;
    }

    // Validate file type
    const allowedTypesArray = allowedTypes.split(",");
    if (!allowedTypesArray.includes(file.type)) {
      toast.error("Invalid file type", {
        description: `Allowed types: ${allowedTypes}`,
      });
      return;
    }

    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Upload file
    setIsUploading(true);
    setProgress(0);

    try {
      const url = await uploadFileWithProgress(file, type, (p) =>
        setProgress(p)
      );
      onUploadComplete(url);
      setPreviewUrl(url);
      toast.success("Upload complete", {
        description: "Your file has been uploaded successfully.",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        description: "There was a problem uploading your file.",
      });
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={allowedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative group">
          {isImage ? (
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleClick}
                  className="px-3 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-100"
                >
                  Replace
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Video className="w-8 h-8 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{previewUrl}</p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={isUploading}
          className="w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-green hover:bg-primary-green/5 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary-green animate-spin" />
              <p className="text-sm text-gray-600">{progress}% uploading...</p>
            </>
          ) : (
            <>
              {isImage ? (
                <ImageIcon className="w-8 h-8 text-gray-400" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400">Max {maxSize}MB</p>
            </>
          )}
        </button>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Or paste a URL directly in the input field below
      </p>
    </div>
  );
};

export default FileUpload;
