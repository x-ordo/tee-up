'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import {
  uploadMedia,
  deleteMedia,
  formatFileSize,
  formatDuration,
  getFileMetadata,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_FILE_SIZES,
  type UploadResult,
} from '@/lib/storage';

// ============================================
// Types
// ============================================

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  path: string;
  mediaType: 'image' | 'video';
  fileName: string;
  fileSize: number;
  duration?: number;
}

interface MediaUploaderProps {
  userId: string;
  folder?: string;
  maxFiles?: number;
  initialMedia?: MediaItem[];
  onUploadComplete?: (media: MediaItem[]) => void;
  onError?: (error: string) => void;
  accept?: 'image' | 'video' | 'all';
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
  result?: MediaItem;
}

// ============================================
// Component
// ============================================

export function MediaUploader({
  userId,
  folder = 'lessons',
  maxFiles = 10,
  initialMedia = [],
  onUploadComplete,
  onError,
  accept = 'all',
  className = '',
}: MediaUploaderProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get accepted file types
  const acceptedTypes = (() => {
    switch (accept) {
      case 'image':
        return ALLOWED_IMAGE_TYPES;
      case 'video':
        return ALLOWED_VIDEO_TYPES;
      default:
        return [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    }
  })();

  const acceptString = acceptedTypes.join(',');

  // Handle file selection
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      // Check max files
      if (media.length + fileArray.length > maxFiles) {
        onError?.(`최대 ${maxFiles}개 파일만 업로드할 수 있습니다.`);
        return;
      }

      // Validate file types
      const validFiles = fileArray.filter((file) => acceptedTypes.includes(file.type));
      if (validFiles.length !== fileArray.length) {
        onError?.('지원하지 않는 파일 형식이 포함되어 있습니다.');
      }

      if (validFiles.length === 0) return;

      // Create uploading entries
      const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
        id: `upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        progress: 0,
        status: 'pending',
      }));

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);

      // Upload files
      for (const uploadingFile of newUploadingFiles) {
        setUploadingFiles((prev) =>
          prev.map((f) =>
            f.id === uploadingFile.id ? { ...f, status: 'uploading', progress: 10 } : f
          )
        );

        try {
          // Get file metadata
          const metadata = await getFileMetadata(uploadingFile.file);

          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === uploadingFile.id ? { ...f, progress: 30 } : f))
          );

          // Upload
          const result = await uploadMedia(uploadingFile.file, userId, { folder });

          setUploadingFiles((prev) =>
            prev.map((f) => (f.id === uploadingFile.id ? { ...f, progress: 90 } : f))
          );

          if (result.success && result.url && result.path) {
            const mediaItem: MediaItem = {
              id: uploadingFile.id,
              url: result.url,
              thumbnailUrl: result.thumbnailUrl,
              path: result.path,
              mediaType: result.mediaType,
              fileName: metadata.fileName,
              fileSize: metadata.fileSize,
              duration: metadata.duration,
            };

            setUploadingFiles((prev) =>
              prev.map((f) =>
                f.id === uploadingFile.id
                  ? { ...f, status: 'complete', progress: 100, result: mediaItem }
                  : f
              )
            );

            setMedia((prev) => {
              const updated = [...prev, mediaItem];
              onUploadComplete?.(updated);
              return updated;
            });
          } else {
            throw new Error(result.error || 'Upload failed');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : '업로드 실패';
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.id === uploadingFile.id ? { ...f, status: 'error', error: errorMessage } : f
            )
          );
          onError?.(errorMessage);
        }
      }

      // Clean up completed uploads after a delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.status !== 'complete'));
      }, 1000);
    },
    [userId, folder, maxFiles, media.length, acceptedTypes, onUploadComplete, onError]
  );

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    // Reset input
    e.target.value = '';
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle delete
  const handleDelete = async (item: MediaItem) => {
    const result = await deleteMedia(item.path);
    if (result.success) {
      setMedia((prev) => {
        const updated = prev.filter((m) => m.id !== item.id);
        onUploadComplete?.(updated);
        return updated;
      });
    } else {
      onError?.(result.error || '삭제 실패');
    }
  };

  // Remove failed upload
  const handleRemoveUpload = (id: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={className}>
      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-tee-accent-primary bg-tee-accent-primary/5'
            : 'border-tee-stone hover:border-tee-ink-muted'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptString}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <svg
            className="h-12 w-12 text-tee-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm text-tee-ink-light">
            클릭하거나 파일을 드래그하여 업로드
          </p>
          <p className="text-xs text-tee-ink-muted">
            {accept === 'image' && `이미지 (최대 ${MAX_FILE_SIZES.IMAGE / 1024 / 1024}MB)`}
            {accept === 'video' && `동영상 (최대 ${MAX_FILE_SIZES.VIDEO / 1024 / 1024}MB)`}
            {accept === 'all' &&
              `이미지 또는 동영상 (최대 ${MAX_FILE_SIZES.VIDEO / 1024 / 1024}MB)`}
          </p>
        </div>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-lg bg-tee-surface p-3"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-tee-ink-strong">{file.file.name}</p>
                <p className="text-xs text-tee-ink-muted">{formatFileSize(file.file.size)}</p>
              </div>

              {file.status === 'uploading' && (
                <div className="h-2 w-24 overflow-hidden rounded-full bg-tee-stone">
                  <div
                    className="h-full bg-tee-accent-primary transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}

              {file.status === 'error' && (
                <>
                  <span className="text-xs text-red-600">{file.error}</span>
                  <button
                    onClick={() => handleRemoveUpload(file.id)}
                    className="text-tee-ink-muted hover:text-tee-ink-strong"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              )}

              {file.status === 'complete' && (
                <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Media Grid */}
      {media.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((item) => (
            <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-tee-stone">
              {item.mediaType === 'image' ? (
                <Image
                  src={item.thumbnailUrl || item.url}
                  alt={item.fileName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <>
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.fileName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-12 w-12 text-tee-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  {/* Video indicator */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
                    <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {item.duration && (
                      <span className="text-xs text-white">{formatDuration(item.duration)}</span>
                    )}
                  </div>
                </>
              )}

              {/* Delete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item);
                }}
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* File info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs text-white">{item.fileName}</p>
                <p className="text-xs text-white/70">{formatFileSize(item.fileSize)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* File count */}
      <p className="mt-2 text-right text-xs text-tee-ink-muted">
        {media.length} / {maxFiles} 파일
      </p>
    </div>
  );
}
