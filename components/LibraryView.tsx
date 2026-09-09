'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Film,
  Play,
  Download,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { GeneratedVideo, AspectRatio } from '@/lib/types';

interface LibraryViewProps {
  videos: GeneratedVideo[];
  onSelectVideoForCanvas: (video: GeneratedVideo) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  videos,
  onSelectVideoForCanvas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRatio, setSelectedRatio] = useState<string>('All');

  const categories = ['All', 'Cinematic', 'Commercial', 'Sci-Fi', 'Documentary', 'Social Short'];
  const ratios = ['All', '16:9', '9:16', '1:1', '21:9'];

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch =
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All' || vid.config.category.toLowerCase().includes(selectedCategory.toLowerCase());

    const matchesRatio =
      selectedRatio === 'All' || vid.config.dimensions === selectedRatio;

    return matchesSearch && matchesCategory && matchesRatio;
  });

  return (
    <div id="library-page-container" className="max-w-6xl mx-auto px-4 py-5 pb-28 text-white select-none">
      {/* Search & Filter Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-[11px]">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Aspect Ratio Filter */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-[11px]">
            {ratios.map((ratio) => (
              <button
                key={ratio}
                onClick={() => setSelectedRatio(ratio)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedRatio === ratio
                    ? 'bg-neutral-800 text-white font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Video Cards */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-neutral-800/80 bg-neutral-950/40 p-8">
          <Film className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No videos found</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or return to the Dashboard to synthesize a new video.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedRatio('All');
            }}
            className="mt-4 px-3 py-1.5 text-xs rounded-md bg-neutral-800 hover:bg-neutral-700 text-white transition-colors font-mono"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              id={`library-video-card-${vid.id}`}
              className="group rounded-xl border border-neutral-800 bg-[#0e0e11] hover:border-neutral-600 transition-all duration-200 overflow-hidden flex flex-col justify-between"
            >
              {/* Card Media Preview Header */}
              <div
                onClick={() => onSelectVideoForCanvas(vid)}
                className="relative aspect-video bg-neutral-950 border-b border-neutral-800 flex items-center justify-center cursor-pointer overflow-hidden group/thumb"
              >
                {/* Visual geometric abstraction */}
                <div className="absolute inset-0 opacity-40 group-hover/thumb:opacity-60 transition-opacity flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-neutral-700 animate-[spin_60s_linear_infinite]" />
                  <div className="absolute w-20 h-20 border border-neutral-600 rotate-45" />
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white border border-neutral-700 backdrop-blur-sm">
                    {vid.config.dimensions}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-neutral-400 border border-neutral-800 backdrop-blur-sm">
                    {vid.config.resolution}
                  </span>
                </div>

                <div className="absolute top-2 right-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-neutral-300 border border-neutral-800 z-10">
                  {vid.config.length}
                </div>

                {/* Center Play Button on hover */}
                <div className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform z-10">
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 z-10">
                  <span>{vid.config.fps}</span>
                  <span>{vid.createdAt}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-white tracking-wide truncate">
                      {vid.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-800 shrink-0">
                      {vid.config.dimensions}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {vid.prompt}
                  </p>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectVideoForCanvas(vid)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-neutral-900 border border-neutral-750 hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-1.5 text-neutral-200"
                  >
                    <span>Load to Canvas</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
