'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Camera, Loader2, X } from 'lucide-react';
import { uploadImage, STORAGE_BUCKETS, ALLOWED_IMAGE_TYPES } from '@/lib/storage';

interface ProfileImageUploadProps {
  userId?: string;
  initialImageUrl?: string;
  onImageChange: (url: string | undefined) => void;
  disabled?: boolean;
}

export function ProfileImageUpload({
  userId,
  initialImageUrl,
  onImageChange,
  disabled = false,
}: ProfileImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset input
      e.target.value = '';

      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError('JPG, PNG, WebP 이미지만 업로드 가능합니다.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('5MB 이하 이미지만 업로드 가능합니다.');
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        // If no userId, create a temporary preview (for unauthenticated users)
        if (!userId) {
          const previewUrl = URL.createObjectURL(file);
          setImageUrl(previewUrl);
          onImageChange(previewUrl);
          // Store file in sessionStorage for later upload
          const reader = new FileReader();
          reader.onloadend = () => {
            sessionStorage.setItem('pendingProfileImage', reader.result as string);
          };
          reader.readAsDataURL(file);
          setIsUploading(false);
          return;
        }

        // Upload to Supabase Storage
        const result = await uploadImage(file, userId, {
          bucket: STORAGE_BUCKETS.PROFILE_IMAGES,
          folder: 'profiles',
          compress: true,
          generateThumbnail: false,
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.85,
        });

        if (result.success && result.url) {
          setImageUrl(result.url);
          onImageChange(result.url);
        } else {
          setError(result.error || '업로드에 실패했습니다.');
        }
      } catch {
        setError('업로드 중 오류가 발생했습니다.');
      } finally {
        setIsUploading(false);
      }
    },
    [userId, onImageChange]
  );

  const handleRemove = useCallback(() => {
    setImageUrl(undefined);
    onImageChange(undefined);
    sessionStorage.removeItem('pendingProfileImage');
  }, [onImageChange]);

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Container */}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className={`
            relative h-28 w-28 overflow-hidden rounded-full
            border-2 border-dashed transition-all
            ${imageUrl
              ? 'border-tee-accent-primary/30'
              : 'border-tee-stone hover:border-tee-ink-muted'
            }
            ${disabled || isUploading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
            focus:outline-none focus:ring-2 focus:ring-tee-accent-primary/20
          `}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="프로필 사진"
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-tee-background/50">
              <span className="text-3xl">👤</span>
            </div>
          )}

          {/* Overlay */}
          {!isUploading && (
            <div className={`
              absolute inset-0 flex items-center justify-center
              bg-black/0 transition-colors
              ${!disabled && 'hover:bg-black/40'}
            `}>
              <Camera className={`
                h-6 w-6 text-white opacity-0 transition-opacity
                ${!disabled && 'group-hover:opacity-100'}
              `} />
            </div>
          )}

          {/* Loading Spinner */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
        </button>

        {/* Remove Button */}
        {imageUrl && !isUploading && !disabled && (
          <button
            type="button"
            onClick={handleRemove}
            className="
              absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center
              rounded-full bg-tee-error text-white shadow-md
              transition-transform hover:scale-110 active:scale-95
            "
            aria-label="사진 삭제"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Camera Badge */}
        {!imageUrl && !isUploading && (
          <div className="
            absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center
            rounded-full bg-tee-accent-primary text-white shadow-md
          ">
            <Camera className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Helper Text */}
      <p className="mt-3 text-center text-xs text-tee-ink-muted">
        {isUploading ? '업로드 중...' : '탭하여 프로필 사진 추가'}
      </p>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-center text-xs text-tee-error">{error}</p>
      )}
    </div>
  );
}
