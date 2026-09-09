'use client';

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, Clock, X } from 'lucide-react';
import { GeneratedVideo } from '@/lib/types';

interface VideoCarouselProps {
  videos: GeneratedVideo[];
  activeVideoId: string;
  onSelectVideo: (video: GeneratedVideo) => void;
  onRemoveVideo?: (videoId: string) => void;
}

export const VideoCarousel: React.FC<VideoCarouselProps> = ({
  videos,
  activeVideoId,
  onSelectVideo,
  onRemoveVideo,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  if (videos.length <= 1) {
    return null; // When only 1 video or empty, no carousel strip needed beneath
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-4 px-2 select-none">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-medium text-neutral-400">
          Generated clips ({videos.length})
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={scrollLeft}
            className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={scrollRight}
            className="p-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Strip */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1 scroll-smooth"
      >
        {videos.map((vid, idx) => {
          const isActive = vid.id === activeVideoId;
          const isNewest = idx === 0;

          return (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              id={`carousel-item-${vid.id}`}
              className={`
                relative shrink-0 w-52 sm:w-56 rounded-lg p-2.5 cursor-pointer
                border transition-all duration-200 group
                ${
                  isActive
                    ? 'bg-neutral-900 border-white shadow-[0_0_12px_rgba(255,255,255,0.12)]'
                    : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900'
                }
              `}
            >
              {/* Thumbnail header */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  {isNewest && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-white text-black font-semibold uppercase">
                      Latest
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded border border-neutral-700 text-neutral-300">
                    {vid.config.dimensions}
                  </span>
                </div>

                {onRemoveVideo && videos.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveVideo(vid.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-white transition-opacity"
                    title="Remove from session"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Title & prompt */}
              <h4 className="text-xs font-medium text-white truncate mb-0.5">
                {vid.title}
              </h4>
              <p className="text-[10px] text-neutral-400 line-clamp-1">
                {vid.prompt}
              </p>

              {/* Card Footer: duration, resolution & active indicator */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-neutral-800 text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-neutral-400" />
                  {vid.config.length} • {vid.config.fps}
                </span>

                {isActive ? (
                  <span className="text-white font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Viewing
                  </span>
                ) : (
                  <span className="text-neutral-400 group-hover:text-white flex items-center gap-1 transition-colors">
                    <Play className="w-2.5 h-2.5 fill-current" />
                    Load
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
