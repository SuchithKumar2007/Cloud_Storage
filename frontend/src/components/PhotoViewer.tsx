import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Heart,
  Share2,
  Download,
  Trash2,
  Info,
  Calendar,
  HardDrive,
  Maximize2
} from 'lucide-react';
import { MediaItem } from '../types';
import { formatBytes } from '../utils/formatters';
import { format, parseISO } from 'date-fns';

interface PhotoViewerProps {
  media: MediaItem | null;
  mediaList: MediaItem[];
  onClose: () => void;
  onNavigate: (media: MediaItem) => void;
  onFavorite: (id: string, isFav: boolean) => void;
  onTrash: (id: string) => void;
  onShare: (media: MediaItem) => void;
}

export const PhotoViewer: React.FC<PhotoViewerProps> = ({
  media,
  mediaList,
  onClose,
  onNavigate,
  onFavorite,
  onTrash,
  onShare
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Reset transform when media changes
    setZoom(1);
    setRotation(0);
  }, [media?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!media) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, mediaList]);

  if (!media) return null;

  const currentIndex = mediaList.findIndex(m => m.id === media.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < mediaList.length - 1 && currentIndex !== -1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(mediaList[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(mediaList[currentIndex + 1]);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col select-none animate-fade-in">
      {/* Top Controls Bar */}
      <div className="h-16 px-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        {/* Left: Close & Filename */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="text-white">
            <p className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
              {media.originalName}
            </p>
            <p className="text-xs text-white/60">
              {format(parseISO(media.createdAt), 'MMMM d, yyyy • h:mm a')}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={handleRotate}
            title="Rotate"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors hidden sm:flex"
          >
            <RotateCw className="w-5 h-5" />
          </button>

          <button
            onClick={() => onFavorite(media.id, !media.isFavorite)}
            title="Favorite"
            className={`p-2 rounded-xl transition-colors ${
              media.isFavorite ? 'text-rose-500 bg-rose-500/20' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Heart className={`w-5 h-5 ${media.isFavorite ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => onShare(media)}
            title="Share"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <a
            href={media.downloadUrl}
            download={media.originalName}
            title="Download"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            onClick={() => setShowInfo(prev => !prev)}
            title="Information"
            className={`p-2 rounded-xl transition-colors ${
              showInfo ? 'text-brand-400 bg-brand-500/20' : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>

          <button
            onClick={() => onTrash(media.id)}
            title="Move to Trash"
            className="p-2 text-white/80 hover:text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Container & Info Drawer */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 bg-black/40 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Photo Canvas */}
        <div
          className="w-full h-full flex items-center justify-center p-4 transition-transform duration-200"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`
          }}
        >
          <img
            src={media.streamUrl}
            alt={media.originalName}
            className="max-h-[82vh] max-w-[88vw] object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 bg-black/40 hover:bg-black/80 text-white rounded-2xl backdrop-blur-md transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Side Info Drawer */}
        {showInfo && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-md border-l border-white/10 p-6 text-white z-30 overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-brand-400" />
                Memory Info
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs text-white/50 mb-1">Original Name</p>
                <p className="font-semibold break-words">{media.originalName}</p>
              </div>

              <div>
                <p className="text-xs text-white/50 mb-1">Date Created</p>
                <p className="font-medium">
                  {format(parseISO(media.createdAt), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-xs text-white/60">
                  {format(parseISO(media.createdAt), 'h:mm:ss a')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/50 mb-1">File Size</p>
                  <p className="font-semibold">{formatBytes(media.fileSize)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1">Resolution</p>
                  <p className="font-semibold">
                    {media.width && media.height ? `${media.width} × ${media.height}` : 'Standard'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-white/50 mb-1">MIME Type</p>
                <span className="inline-block px-2.5 py-1 bg-white/10 rounded-lg text-xs font-mono">
                  {media.mimeType}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-white/50 mb-1">Privacy & Storage</p>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Encrypted Private Storage
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
