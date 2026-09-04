import React, { useState, useEffect } from 'react';
import { Music, Play } from 'lucide-react';
import { MediaItem } from '../types';
import { mediaApi } from '../services/api';
import { MediaGrid } from '../components/MediaGrid';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { EmptyState } from '../components/EmptyState';
import { useToast } from '../context/ToastContext';

interface AudioPageProps {
  searchQuery: string;
  selectedIds: string[];
  onToggleSelect: (id: string, e: React.MouseEvent) => void;
  onSelectGroup: (ids: string[]) => void;
  onClickMedia: (media: MediaItem, list: MediaItem[]) => void;
  onOpenUpload: () => void;
  onFavorite: (id: string, isFav: boolean) => void;
  reloadTrigger: number;
}

export const AudioPage: React.FC<AudioPageProps> = ({
  searchQuery,
  selectedIds,
  onToggleSelect,
  onSelectGroup,
  onClickMedia,
  onOpenUpload,
  onFavorite,
  reloadTrigger
}) => {
  const [tracks, setTracks] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { error } = useToast();

  const loadAudio = async () => {
    setIsLoading(true);
    try {
      const res = await mediaApi.list({
        view: 'audio',
        search: searchQuery || undefined,
        limit: 200
      });
      if (res.success && res.data) {
        setTracks(res.data.items);
      }
    } catch {
      error('Failed to load audio tracks.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAudio();
  }, [searchQuery, reloadTrigger]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Music & Audio
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              {tracks.length} {tracks.length === 1 ? 'Track' : 'Tracks'}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Your private cloud music collection and audio memories
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <Music className="w-4 h-4" />
          <span>Upload MP3</span>
        </button>
      </div>

      {isLoading ? (
        <SkeletonLoader count={12} />
      ) : tracks.length === 0 ? (
        <EmptyState
          icon={Music}
          title={searchQuery ? 'No tracks found' : 'No music or audio yet'}
          description={
            searchQuery
              ? `No audio files matching "${searchQuery}"`
              : 'Upload your favorite MP3 songs, recordings, and audio files to your 5 TB private cloud.'
          }
          actionText="Upload Audio Track"
          onAction={onOpenUpload}
        />
      ) : (
        <MediaGrid
          media={tracks}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onSelectGroup={onSelectGroup}
          onClickMedia={item => onClickMedia(item, tracks)}
          onFavorite={onFavorite}
        />
      )}
    </div>
  );
};
