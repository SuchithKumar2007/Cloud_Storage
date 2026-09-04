import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  UploadCloud,
  X,
  FileImage,
  FileVideo,
  FileAudio,
  Music,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { mediaApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { UploadQueueItem } from '../types';
import { formatBytes } from '../utils/formatters';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete
}) => {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { refreshStorage } = useAuth();
  const { success, error } = useToast();

  const uploadFileItem = async (item: UploadQueueItem, forceDuplicate = false) => {
    setQueue(prev =>
      prev.map(q => (q.id === item.id ? { ...q, status: 'uploading', progress: 0 } : q))
    );

    try {
      const res = await mediaApi.upload(item.file, forceDuplicate, progress => {
        setQueue(prev =>
          prev.map(q => (q.id === item.id ? { ...q, progress } : q))
        );
      });

      if (res.data?.duplicateDetected && !forceDuplicate) {
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id
              ? {
                  ...q,
                  status: 'duplicate',
                  duplicateInfo: res.data.existingMedia,
                  error: 'Duplicate file detected'
                }
              : q
          )
        );
      } else {
        setQueue(prev =>
          prev.map(q =>
            q.id === item.id ? { ...q, status: 'completed', progress: 100 } : q
          )
        );
      }
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || err.message || 'Upload failed';
      setQueue(prev =>
        prev.map(q =>
          q.id === item.id ? { ...q, status: 'error', error: errMsg } : q
        )
      );
    }
  };

  const startUploads = async (itemsToUpload: UploadQueueItem[]) => {
    setIsUploading(true);
    // Upload files concurrently
    await Promise.all(itemsToUpload.map(item => uploadFileItem(item)));
    setIsUploading(false);
    await refreshStorage();
    onUploadComplete();
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: UploadQueueItem[] = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        file,
        progress: 0,
        status: 'pending'
      }));

      setQueue(prev => [...prev, ...newItems]);
      startUploads(newItems);
    },
    [refreshStorage, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.heic'],
      'video/*': ['.mp4', '.mov', '.webm', '.avi'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']
    }
  });

  const handleRetry = (item: UploadQueueItem) => {
    uploadFileItem(item, false);
  };

  const handleUploadAnyway = (item: UploadQueueItem) => {
    uploadFileItem(item, true);
  };

  const handleRemove = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#121824] border border-gray-200 dark:border-[#26334D] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-[#26334D] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-500">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Upload Memories
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                5 TB private encrypted cloud storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[0.99]'
                : 'border-gray-300 dark:border-[#26334D] hover:border-brand-500/70 bg-gray-50/50 dark:bg-[#1A2234]/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-500 flex items-center justify-center mb-3 shadow-glow">
              <UploadCloud className="w-7 h-7" />
            </div>
            <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
              Drag & Drop Photos, Videos & MP3 Music Here
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              JPG, PNG, WEBP, MP3, WAV, MP4 & MOV • No per-file limit on MP4 files (Up to 5 TB total storage)
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-white dark:bg-[#121824] border border-gray-200 dark:border-[#26334D] hover:border-brand-500 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm"
            >
              Select Files from Device
            </button>
          </div>

          {/* Upload Queue List */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Uploading Queue ({queue.length})
                </h4>
                {queue.some(q => q.status === 'completed') && (
                  <button
                    onClick={() =>
                      setQueue(prev => prev.filter(q => q.status !== 'completed'))
                    }
                    className="text-xs text-brand-500 hover:underline"
                  >
                    Clear Completed
                  </button>
                )}
              </div>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {queue.map(item => {
                  const isImage = item.file.type.startsWith('image/');
                  const isAudio = item.file.type.startsWith('audio/') || 
                    item.file.name.toLowerCase().endsWith('.mp3') || 
                    item.file.name.toLowerCase().endsWith('.wav') ||
                    item.file.name.toLowerCase().endsWith('.m4a');
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 dark:bg-[#1A2234] border border-gray-200 dark:border-[#26334D] rounded-2xl flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-xl bg-white dark:bg-[#121824] shrink-0 ${
                            isAudio ? 'text-purple-500' : 'text-brand-500'
                          }`}>
                            {isImage ? (
                              <FileImage className="w-4 h-4" />
                            ) : isAudio ? (
                              <FileAudio className="w-4 h-4" />
                            ) : (
                              <FileVideo className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {item.file.name}
                            </p>
                            <p className="text-[11px] text-gray-400">
                              {formatBytes(item.file.size)}
                            </p>
                          </div>
                        </div>

                        {/* Status indicators */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.status === 'uploading' && (
                            <span className="text-xs font-mono font-bold text-brand-500">
                              {item.progress}%
                            </span>
                          )}

                          {item.status === 'completed' && (
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                              Done
                            </span>
                          )}

                          {item.status === 'error' && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-rose-500 font-medium">
                                {item.error}
                              </span>
                              <button
                                onClick={() => handleRetry(item)}
                                className="p-1 text-gray-400 hover:text-brand-500"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => handleRemove(item.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {item.status === 'uploading' && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-500 h-full rounded-full transition-all duration-200"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}

                      {/* Duplicate Alert Box */}
                      {item.status === 'duplicate' && (
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>This memory already exists in your library.</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUploadAnyway(item)}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
                            >
                              Upload Anyway
                            </button>
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#1A2234] border-t border-gray-100 dark:border-[#26334D] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {isUploading ? 'Uploading...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
