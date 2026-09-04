export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  ownerId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  fileHash: string;
  storagePath: string;
  thumbnailPath?: string | null;
  width?: number | null;
  height?: number | null;
  duration?: number | null;
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  takenAt?: string | null;
  cameraModel?: string | null;
  createdAt: string;
  updatedAt: string;
  streamUrl: string;
  thumbnailUrl?: string | null;
  downloadUrl: string;
}

export interface Album {
  id: string;
  title: string;
  description?: string | null;
  itemCount: number;
  coverMedia?: MediaItem | null;
  createdAt: string;
  updatedAt: string;
  media?: MediaItem[];
}

export interface ShareLink {
  id: string;
  token: string;
  publicUrl: string;
  resourceType: 'media' | 'album';
  resourceName: string;
  expiresAt?: string | null;
  allowDownload: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
}

export interface StorageStats {
  usedBytes: number;
  limitBytes: number;
  remainingBytes: number;
  percentageUsed: number;
  photosBytes: number;
  videosBytes: number;
  audioBytes?: number;
  otherBytes: number;
  totalFiles: number;
  totalPhotos: number;
  totalVideos: number;
  totalAudio?: number;
  formattedUsed: string;
  formattedLimit: string;
  formattedRemaining: string;
}

export interface UploadQueueItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error' | 'duplicate';
  error?: string;
  duplicateInfo?: any;
}
