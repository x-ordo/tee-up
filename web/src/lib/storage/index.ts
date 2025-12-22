/**
 * Supabase Storage utilities for media uploads
 * Handles image compression, video uploads, and file management
 */

import { createClient } from '@/lib/supabase/client';

// ============================================
// Constants
// ============================================

export const STORAGE_BUCKETS = {
  LESSON_MEDIA: 'lesson-media',
  PROFILE_IMAGES: 'profile-images',
  PORTFOLIO_IMAGES: 'portfolio-images',
} as const;

export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  COMPRESSED_IMAGE: 1 * 1024 * 1024, // 1MB target after compression
} as const;

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];

// ============================================
// Types
// ============================================

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  thumbnailUrl?: string;
  error?: string;
}

export interface UploadOptions {
  bucket?: string;
  folder?: string;
  generateThumbnail?: boolean;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // for videos
}

// ============================================
// Image Compression
// ============================================

/**
 * Compress an image file using canvas
 * @param file - Original image file
 * @param options - Compression options
 * @returns Compressed file as Blob
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<Blob> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate a thumbnail from an image
 */
export async function generateImageThumbnail(
  file: File,
  size: number = 200
): Promise<Blob> {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.6,
  });
}

/**
 * Generate a thumbnail from a video
 */
export async function generateVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    video.onloadedmetadata = () => {
      // Seek to 1 second or 10% of video, whichever is smaller
      video.currentTime = Math.min(1, video.duration * 0.1);
    };

    video.onseeked = () => {
      canvas.width = 320;
      canvas.height = Math.round((320 * video.videoHeight) / video.videoWidth);

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to generate video thumbnail'));
          }
        },
        'image/jpeg',
        0.7
      );
    };

    video.onerror = () => reject(new Error('Failed to load video'));
    video.src = URL.createObjectURL(file);
  });
}

// ============================================
// Upload Functions
// ============================================

/**
 * Generate a unique file path for storage
 */
function generateFilePath(
  userId: string,
  folder: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop()?.toLowerCase() || 'bin';
  return `${userId}/${folder}/${timestamp}-${randomId}.${extension}`;
}

/**
 * Upload an image to Supabase Storage
 * Automatically compresses if needed
 */
export async function uploadImage(
  file: File,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    bucket = STORAGE_BUCKETS.LESSON_MEDIA,
    folder = 'images',
    compress = true,
    generateThumbnail = true,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
  } = options;

  try {
    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        success: false,
        error: '지원하지 않는 이미지 형식입니다. (JPEG, PNG, WebP, GIF만 가능)',
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZES.IMAGE) {
      return {
        success: false,
        error: `파일 크기가 너무 큽니다. (최대 ${MAX_FILE_SIZES.IMAGE / 1024 / 1024}MB)`,
      };
    }

    const supabase = createClient();

    // Compress image if needed
    let uploadBlob: Blob = file;
    if (compress && file.size > MAX_FILE_SIZES.COMPRESSED_IMAGE) {
      uploadBlob = await compressImage(file, { maxWidth, maxHeight, quality });
    }

    // Generate file path
    const filePath = generateFilePath(userId, folder, file.name);

    // Upload main image
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, uploadBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    let thumbnailUrl: string | undefined;

    // Generate and upload thumbnail
    if (generateThumbnail) {
      try {
        const thumbnail = await generateImageThumbnail(file);
        const thumbnailPath = filePath.replace(/\.[^.]+$/, '_thumb.jpg');

        await supabase.storage.from(bucket).upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

        const { data: thumbUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = thumbUrlData.publicUrl;
      } catch {
        // Thumbnail generation failed, but main upload succeeded
        console.warn('Thumbnail generation failed');
      }
    }

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      thumbnailUrl,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.',
    };
  }
}

/**
 * Upload a video to Supabase Storage
 */
export async function uploadVideo(
  file: File,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  const {
    bucket = STORAGE_BUCKETS.LESSON_MEDIA,
    folder = 'videos',
    generateThumbnail = true,
  } = options;

  try {
    // Validate file type
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return {
        success: false,
        error: '지원하지 않는 동영상 형식입니다. (MP4, MOV, WebM만 가능)',
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZES.VIDEO) {
      return {
        success: false,
        error: `파일 크기가 너무 큽니다. (최대 ${MAX_FILE_SIZES.VIDEO / 1024 / 1024}MB)`,
      };
    }

    const supabase = createClient();

    // Generate file path
    const filePath = generateFilePath(userId, folder, file.name);

    // Upload video
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    let thumbnailUrl: string | undefined;

    // Generate and upload thumbnail
    if (generateThumbnail) {
      try {
        const thumbnail = await generateVideoThumbnail(file);
        const thumbnailPath = filePath.replace(/\.[^.]+$/, '_thumb.jpg');

        await supabase.storage.from(bucket).upload(thumbnailPath, thumbnail, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

        const { data: thumbUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(thumbnailPath);
        thumbnailUrl = thumbUrlData.publicUrl;
      } catch {
        console.warn('Video thumbnail generation failed');
      }
    }

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
      thumbnailUrl,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '동영상 업로드에 실패했습니다.',
    };
  }
}

/**
 * Upload any media file (auto-detects image vs video)
 */
export async function uploadMedia(
  file: File,
  userId: string,
  options: UploadOptions = {}
): Promise<UploadResult & { mediaType: 'image' | 'video' }> {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    const result = await uploadImage(file, userId, options);
    return { ...result, mediaType: 'image' };
  } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    const result = await uploadVideo(file, userId, options);
    return { ...result, mediaType: 'video' };
  } else {
    return {
      success: false,
      error: '지원하지 않는 파일 형식입니다.',
      mediaType: 'image',
    };
  }
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteMedia(
  path: string,
  bucket: string = STORAGE_BUCKETS.LESSON_MEDIA
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return { success: false, error: error.message };
    }

    // Also try to delete thumbnail if exists
    const thumbnailPath = path.replace(/\.[^.]+$/, '_thumb.jpg');
    await supabase.storage.from(bucket).remove([thumbnailPath]);

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : '파일 삭제에 실패했습니다.',
    };
  }
}

/**
 * Get file metadata from a File object
 */
export async function getFileMetadata(file: File): Promise<FileMetadata> {
  const metadata: FileMetadata = {
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };

  // Get image dimensions
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        metadata.width = img.width;
        metadata.height = img.height;
        resolve();
      };
      img.onerror = () => resolve();
      img.src = URL.createObjectURL(file);
    });
  }

  // Get video metadata
  if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    await new Promise<void>((resolve) => {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        metadata.width = video.videoWidth;
        metadata.height = video.videoHeight;
        metadata.duration = Math.round(video.duration);
        resolve();
      };
      video.onerror = () => resolve();
      video.src = URL.createObjectURL(file);
    });
  }

  return metadata;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
