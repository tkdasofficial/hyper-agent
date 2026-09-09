'use client';

import React, { useState } from 'react';
import { Sparkles, RotateCcw, Copy, Check, Film } from 'lucide-react';
import { GeneratedVideo } from '@/lib/types';
import { CanvasPlayer } from '@/components/CanvasPlayer';

interface RecentGenerationViewProps {
  video: GeneratedVideo | undefined;
  isGenerating: boolean;
  generatingStage: string;
  onRegenerate: (video: GeneratedVideo) => void;
}

export const RecentGenerationView: React.FC<RecentGenerationViewProps> = ({
  video,
  isGenerating,
  generatingStage,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!video) return;
    navigator.clipboard.writeText(video.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isGenerating) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-black border border-neutral-800 text-center select-none">
        <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6 text-white animate-spin" />
        </div>
        <h3 className="text-sm font-semibold text-white mb-1">Generating Video</h3>
        <p className="text-xs text-neutral-400 font-mono max-w-sm mb-4">
          {generatingStage || 'Synthesizing motion and audio...'}
        </p>
        <div className="w-48 h-1 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
          <div className="h-full bg-white rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 rounded-3xl bg-black border border-neutral-900 text-center select-none">
        <div className="w-10 h-10 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-3">
          <Film className="w-4 h-4 text-neutral-500" />
        </div>
        <p className="text-xs font-medium text-neutral-400">No recent generation</p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Type your prompt above and tap Generate Video
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Active Video Player */}
      <CanvasPlayer
        key={video.id}
        video={video}
        onRegenerate={onRegenerate}
      />

      {/* Minimal Pure B&W Controls Footer */}
      <div className="w-full max-w-xl mt-3 px-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-white truncate">{video.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono">
            {video.config.dimensions} • {video.durationSeconds}s
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full bg-black hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span>Prompt</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onRegenerate(video)}
            className="inline-flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-full bg-black hover:bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-neutral-400" />
            <span>Re-render</span>
          </button>
        </div>
      </div>
    </div>
  );
};
