'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Clock,
  Trash2,
  Copy,
  Layers,
  Sparkles,
  Film,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { GeneratedVideo } from '@/lib/types';
import { CanvasPlayer } from '@/components/CanvasPlayer';

interface ResultCanvasThreePanelProps {
  videos: GeneratedVideo[];
  activeVideo: GeneratedVideo | undefined;
  onSelectVideo: (video: GeneratedVideo) => void;
  onRegenerate: (video: GeneratedVideo) => void;
  onUsePromptAndSettings: (video: GeneratedVideo) => void;
  onRemoveVideo: (id: string) => void;
  isGenerating: boolean;
  generatingStage: string;
}

type PanelIndex = 0 | 1 | 2; // 0: History, 1: Canvas, 2: Queue

export const ResultCanvasThreePanel: React.FC<ResultCanvasThreePanelProps> = ({
  videos,
  activeVideo,
  onSelectVideo,
  onRegenerate,
  onUsePromptAndSettings,
  onRemoveVideo,
  isGenerating,
  generatingStage,
}) => {
  const [activePanel, setActivePanel] = useState<PanelIndex>(1); // Default to Center Canvas
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const targetScrollLeft = activePanel * container.clientWidth;
    container.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
  }, [activePanel]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const width = container.clientWidth;
    if (width === 0) return;
    const newIndex = Math.round(container.scrollLeft / width) as PanelIndex;
    if (newIndex >= 0 && newIndex <= 2 && newIndex !== activePanel) {
      setActivePanel(newIndex);
    }
  };

  const scrollToPanel = (index: PanelIndex) => {
    setActivePanel(index);
  };

  const handleCopyPrompt = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSimulatedPublish = (platform: string, videoId: string) => {
    setPublishedId(`${platform}-${videoId}`);
    setTimeout(() => setPublishedId(null), 2500);
  };

  return (
    <div id="three-panel-canvas-container" className="w-full flex flex-col select-none">
      {/* Segmented Switcher */}
      <div className="flex items-center justify-between gap-2 px-1 mb-2.5">
        <div className="flex items-center p-1 bg-[#090a0d] border border-neutral-800 rounded-xl w-full max-w-xs">
          <button
            type="button"
            id="tab-panel-active"
            onClick={() => scrollToPanel(1)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePanel === 1
                ? 'bg-white text-black shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Canvas</span>
          </button>

          <button
            type="button"
            id="tab-panel-history"
            onClick={() => scrollToPanel(0)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePanel === 0
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>History ({videos.length})</span>
          </button>

          <button
            type="button"
            id="tab-panel-queue"
            onClick={() => scrollToPanel(2)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activePanel === 2
                ? 'bg-neutral-800 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Queue</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <button
            type="button"
            onClick={() => scrollToPanel(Math.max(0, activePanel - 1) as PanelIndex)}
            disabled={activePanel === 0}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollToPanel(Math.min(2, activePanel + 1) as PanelIndex)}
            disabled={activePanel === 2}
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Swipeable Track */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar rounded-2xl border border-neutral-800/80 bg-[#070709] min-h-[440px]"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* ========================================================================= */}
        {/* PANEL 0: HISTORY (Clean, Compact List) */}
        {/* ========================================================================= */}
        <div
          id="panel-history"
          className="w-full shrink-0 snap-center p-3 sm:p-4 flex flex-col justify-start overflow-y-auto max-h-[640px]"
        >
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutral-800/60">
            <span className="text-xs font-semibold text-white">Video History</span>
            <span className="text-[11px] text-neutral-400 font-mono">{videos.length} videos</span>
          </div>

          {videos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <Film className="w-7 h-7 text-neutral-600 mb-2" />
              <p className="text-xs text-neutral-400">No videos yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {videos.map((vid) => {
                const isActive = activeVideo?.id === vid.id;

                return (
                  <div
                    key={vid.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                      isActive
                        ? 'bg-neutral-800/90 border-neutral-600'
                        : 'bg-[#0a0b0e] border-neutral-800/80 hover:border-neutral-700'
                    }`}
                  >
                    {/* Clickable Area to Play */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectVideo(vid);
                        scrollToPanel(1);
                      }}
                      className="flex-1 flex items-center gap-2.5 text-left min-w-0 cursor-pointer"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-300'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white truncate">
                            {vid.title}
                          </span>
                          {isActive && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-white text-black font-bold uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {vid.config.dimensions} • {vid.durationSeconds}s • {vid.config.category}
                        </div>
                      </div>
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUsePromptAndSettings(vid)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-[11px] transition-colors"
                        title="Load into Prompt"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveVideo(vid.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 text-[11px] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 1: CANVAS (Default Active Focus) */}
        {/* ========================================================================= */}
        <div
          id="panel-active-player"
          className="w-full shrink-0 snap-center p-3 sm:p-4 flex flex-col items-center justify-center"
        >
          {isGenerating ? (
            <div className="w-full max-w-md aspect-[9/16] sm:aspect-video rounded-2xl bg-black border border-neutral-800 flex flex-col items-center justify-center p-6 text-center">
              <Sparkles className="w-7 h-7 text-white animate-spin mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Generating Video</h3>
              <p className="text-xs text-neutral-400 font-mono max-w-xs mb-4">
                {generatingStage || 'Synthesizing audio & motion...'}
              </p>
              <div className="w-48 h-1 rounded-full bg-neutral-800 overflow-hidden">
                <div className="h-full bg-white rounded-full animate-pulse w-2/3" />
              </div>
            </div>
          ) : activeVideo ? (
            <div className="w-full flex flex-col items-center">
              {/* Video Player */}
              <CanvasPlayer
                key={activeVideo.id}
                video={activeVideo}
                onRegenerate={onRegenerate}
              />

              {/* Minimal Video Footer */}
              <div className="w-full max-w-xl mt-3 px-1 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-white truncate">{activeVideo.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
                    {activeVideo.config.dimensions}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(activeVideo.prompt, activeVideo.id)}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                  >
                    {copiedId === activeVideo.id ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-neutral-400" />
                    )}
                    <span>{copiedId === activeVideo.id ? 'Copied' : 'Prompt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRegenerate(activeVideo)}
                    className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-neutral-400" />
                    <span>Re-render</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8">
              <Film className="w-8 h-8 text-neutral-600 mb-2" />
              <p className="text-xs text-neutral-400">Select a video or tap Generate</p>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* PANEL 2: QUEUE */}
        {/* ========================================================================= */}
        <div
          id="panel-draft-queue"
          className="w-full shrink-0 snap-center p-3 sm:p-4 flex flex-col justify-start overflow-y-auto max-h-[640px]"
        >
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-neutral-800/60">
            <span className="text-xs font-semibold text-white">Draft Queue & Export</span>
            <span className="text-[11px] text-neutral-400 font-mono">Ready</span>
          </div>

          <div className="flex flex-col gap-2">
            {videos.slice(0, 4).map((draft) => (
              <div
                key={draft.id}
                className="p-3 rounded-xl bg-[#0a0b0e] border border-neutral-800/80 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{draft.title}</div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                    {draft.config.dimensions} • {draft.durationSeconds}s • {draft.config.resolution}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSimulatedPublish('share', draft.id)}
                    className="py-1 px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] border border-neutral-800 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {publishedId === `share-${draft.id}` ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Shared
                      </span>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3 text-neutral-400" />
                        <span>Export</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
