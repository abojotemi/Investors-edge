import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "@/config/firebase";

export type UploadType = "thumbnails" | "images" | "videos";

/**
 * Upload a file to Firebase Storage
 * @param file - The file to upload
 * @param type - The type/folder for the upload (thumbnails, images, videos)
 * @param customPath - Optional custom path within the type folder
 * @returns The download URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  type: UploadType,
  customPath?: string
): Promise<string> => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${safeName}`;
    const path = customPath
      ? `${type}/${customPath}/${filename}`
      : `${type}/${filename}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    console.log("File uploaded successfully:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Upload a file with progress tracking
 * @param file - The file to upload
 * @param type - The type/folder for the upload
 * @param onProgress - Callback for upload progress (0-100)
 * @param customPath - Optional custom path
 * @returns The download URL of the uploaded file
 */
export const uploadFileWithProgress = (
  file: File,
  type: UploadType,
  onProgress: (progress: number) => void,
  customPath?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}_${safeName}`;
      const path = customPath
        ? `${type}/${customPath}/${filename}`
        : `${type}/${filename}`;

      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File uploaded successfully:", downloadURL);
          resolve(downloadURL);
        }
      );
    } catch (error) {
      console.error("Error initiating upload:", error);
      reject(error);
    }
  });
};

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - The full download URL of the file to delete
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract the path from the URL
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    console.log("File deleted successfully");
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might not exist
  }
};

/**
 * Get allowed file types for upload
 */
export const getAllowedFileTypes = (type: UploadType): string => {
  switch (type) {
    case "thumbnails":
    case "images":
      return "image/jpeg,image/png,image/webp,image/gif";
    case "videos":
      return "video/mp4,video/webm,video/ogg";
    default:
      return "*";
  }
};

/**
 * Validate file size (in MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

/**
 * Get max file size for upload type (in MB)
 */
export const getMaxFileSize = (type: UploadType): number => {
  switch (type) {
    case "thumbnails":
      return 5; // 5MB
    case "images":
      return 10; // 10MB
    case "videos":
      return 500; // 500MB
    default:
      return 10;
  }
};
