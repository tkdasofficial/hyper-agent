'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  ArrowUp,
  ChevronDown,
  Loader2,
  Clock,
  Tv,
  Gauge,
  Activity,
  Layers,
  Mic,
  Palette,
  Maximize,
  X,
} from 'lucide-react';
import { VideoConfig } from '@/lib/types';
import { ConfigPillType } from './PillConfigModal';

interface PromptBarProps {
  prompt: string;
  onPromptChange: (val: string) => void;
  config: VideoConfig;
  onOpenPillModal: (type: ConfigPillType) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generatingStage?: string;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  prompt,
  onPromptChange,
  config,
  onOpenPillModal,
  onGenerate,
  isGenerating,
  generatingStage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 44), 120)}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  const pills: { type: ConfigPillType; label: string; value: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { type: 'length', label: 'Length', value: config.length, icon: Clock },
    { type: 'resolution', label: 'Resolution', value: config.resolution, icon: Tv },
    { type: 'fps', label: 'FPS', value: config.fps, icon: Gauge },
    { type: 'bitrate', label: 'Bitrate', value: config.bitrate, icon: Activity },
    { type: 'category', label: 'Category', value: config.category, icon: Layers },
    { type: 'voice', label: 'Voice', value: config.voice, icon: Mic },
    { type: 'tone', label: 'Tone', value: config.tone, icon: Palette },
    { type: 'dimensions', label: 'Dimensions', value: config.dimensions, icon: Maximize },
  ];

  return (
    <div
      id="fixed-bottom-prompt-container"
      className="fixed bottom-3 sm:bottom-4 inset-x-0 mx-auto max-w-4xl z-30 px-3 sm:px-4 pointer-events-none"
    >
      <div className="pointer-events-auto rounded-2xl border border-neutral-800 bg-[#0d0d10]/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.85)] p-2.5 sm:p-3 transition-all">
        {/* Generating Status Banner if active */}
        {isGenerating && (
          <div className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>{generatingStage || 'Directing video sequence...'}</span>
          </div>
        )}

        {/* Input Area: Multi-line text input & Send Action Button */}
        <div className="flex items-end gap-2.5">
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              id="prompt-input-textarea"
              rows={1}
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isGenerating}
              placeholder="Describe your scene (e.g. 'Macro slow-motion shot of liquid metal flowing into geometry')..."
              className="w-full bg-transparent text-white placeholder-neutral-500 text-xs sm:text-sm resize-none focus:outline-none py-2 px-1 max-h-32 leading-relaxed"
            />
            {prompt.length > 0 && !isGenerating && (
              <button
                onClick={() => onPromptChange('')}
                className="p-1 rounded text-neutral-500 hover:text-neutral-300 transition-colors mr-1"
                title="Clear prompt"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Side: Action "Generate Video" Send button */}
          <button
            id="btn-generate-video-action"
            onClick={onGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`
              shrink-0 h-9 px-4 rounded-lg text-xs font-medium tracking-wide
              transition-colors flex items-center justify-center gap-1.5 select-none
              ${
                !prompt.trim() || isGenerating
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-750'
                  : 'bg-white text-black hover:bg-neutral-200 active:scale-95 focus:outline-none'
              }
            `}
            title="Generate video"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-400" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 fill-black text-black" />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>

        {/* Bottom Horizontal Scrollable Pills (Clickable for Pop-up Modal Configs) */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800/80">
          <div
            id="bottom-horizontal-pills-row"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
          >
            {pills.map((pill) => {
              const Icon = pill.icon;
              return (
                <button
                  key={pill.type}
                  id={`pill-config-${pill.type}`}
                  onClick={() => onOpenPillModal(pill.type)}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white transition-colors whitespace-nowrap group focus:outline-none"
                  title={pill.label}
                >
                  <Icon className="w-3 h-3 text-neutral-400 group-hover:text-white transition-colors shrink-0" />
                  <span className="font-medium text-neutral-100">{pill.value}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
