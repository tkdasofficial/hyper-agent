'use client';

import React, { useRef, useEffect } from 'react';
import {
  ChevronDown,
  Sparkles,
  PenTool,
  Film,
  Monitor,
  Mic,
  SlidersHorizontal,
  Flame,
  Cpu,
  BookOpen,
  Gamepad2,
  Clapperboard,
  Smartphone,
  Check,
  Clock,
  Palette,
  Crop,
  Volume2,
  Zap,
  Camera,
  Moon,
  Layers,
} from 'lucide-react';
import { VideoConfig, AspectRatio } from '@/lib/types';

export type AccordionBarId =
  | 'prompt'
  | 'category'
  | 'tone'
  | 'ratio'
  | 'resolution'
  | 'duration'
  | 'voice'
  | 'accent'
  | 'style';

interface AccordionStackProps {
  activeBar: AccordionBarId | null;
  onToggleBar: (barId: AccordionBarId) => void;
  prompt: string;
  onPromptChange: (val: string) => void;
  onEnhancePrompt: () => void;
  isEnhancingPrompt: boolean;
  config: VideoConfig;
  onUpdateConfig: (updates: Partial<VideoConfig>) => void;
}

export const AccordionStack: React.FC<AccordionStackProps> = ({
  activeBar,
  onToggleBar,
  prompt,
  onPromptChange,
  onEnhancePrompt,
  isEnhancingPrompt,
  config,
  onUpdateConfig,
}) => {
  const promptTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (activeBar === 'prompt' && promptTextareaRef.current) {
      promptTextareaRef.current.focus();
    }
  }, [activeBar]);

  const categories = [
    { id: 'Horror', name: 'Horror', icon: Flame },
    { id: 'Tech', name: 'Tech', icon: Cpu },
    { id: 'Storytelling', name: 'Story', icon: BookOpen },
    { id: 'Gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'Cinematic', name: 'Cinema', icon: Clapperboard },
    { id: 'Social Short', name: 'Shorts', icon: Smartphone },
  ];

  const tones = [
    { id: 'Dark Dramatic', name: 'Dark Dramatic', desc: 'High contrast shadows & deep blacks' },
    { id: 'Monochrome', name: 'Monochrome', desc: 'Pure silver, obsidian & stark lighting' },
    { id: 'Minimalist', name: 'Minimalist', desc: 'Clean negative space & quiet framing' },
    { id: 'High Contrast', name: 'High Contrast', desc: 'Sharp stark silhouettes & crisp rims' },
    { id: 'Cyber Noir', name: 'Cyber Noir', desc: 'Gritty shadows & atmospheric reflections' },
    { id: 'Ethereal', name: 'Ethereal', desc: 'Soft diffused highlights & floating mist' },
  ];

  const aspectRatios: { id: AspectRatio; name: string; shapeClass: string; desc: string }[] = [
    { id: '9:16', name: '9:16 Vertical', shapeClass: 'w-3 h-5.5', desc: 'Reels, TikTok, Shorts' },
    { id: '16:9', name: '16:9 Wide', shapeClass: 'w-5.5 h-3', desc: 'YouTube & Desktop' },
    { id: '1:1', name: '1:1 Square', shapeClass: 'w-4 h-4', desc: 'Feed & Instagram' },
    { id: '4:5', name: '4:5 Social', shapeClass: 'w-3.5 h-4.5', desc: 'Social Portrait' },
    { id: '21:9', name: '21:9 Cinema', shapeClass: 'w-6 h-2.5', desc: 'Anamorphic Widescreen' },
  ];

  const resolutions = [
    { id: '1080p FHD', name: '1080p FHD', desc: '1080×1920 • High Definition', tag: 'Standard' },
    { id: '4K UHD', name: '4K UHD', desc: '2160×3840 • Ultra High-Res', tag: 'Ultra' },
    { id: '720p HD', name: '720p HD', desc: '720×1280 • Standard Definition', tag: 'Fast' },
  ];

  const durations = [
    { id: '10s', name: '10 Seconds', desc: 'Quick teaser preview', tag: 'Teaser' },
    { id: '15s', name: '15 Seconds', desc: 'Standard social short', tag: 'Short' },
    { id: '30s', name: '30 Seconds', desc: 'Full narrative arc', tag: 'Medium' },
    { id: '60s', name: '60 Seconds', desc: 'Extended story sequence', tag: 'Long' },
  ];

  const voices = [
    { id: 'Echo Deep Male', name: 'Echo', role: 'Deep Male Narrator', badge: 'Baritone' },
    { id: 'Nova Warm Female', name: 'Nova', role: 'Warm Female Host', badge: 'Warm' },
    { id: 'Onyx Gritty', name: 'Onyx', role: 'Gritty Noir Voice', badge: 'Gritty' },
    { id: 'Alloy Neutral', name: 'Alloy', role: 'Tech Presenter', badge: 'Crisp' },
    { id: 'Shimmer Lucid', name: 'Shimmer', role: 'Ambient Lucid Voice', badge: 'Soft' },
  ];

  const accents = [
    { id: 'US Neutral', name: 'US Neutral', desc: 'Standard broadcast cadence' },
    { id: 'British RP', name: 'British RP', desc: 'Crisp formal English diction' },
    { id: 'Nordic', name: 'Nordic', desc: 'Calm measured tempo' },
    { id: 'Minimal', name: 'Minimal', desc: 'Whisper & ambient cadence' },
  ];

  const styles = [
    {
      id: 'Dynamic Shorts',
      name: 'Dynamic Shorts',
      desc: 'High-energy fast cuts & energetic pacing',
      tag: 'Fast Cuts',
      icon: Zap,
    },
    {
      id: 'Cinematic Suspense',
      name: 'Cinematic Suspense',
      desc: 'Atmospheric slow push & intense hold',
      tag: 'Slow Zoom',
      icon: Camera,
    },
    {
      id: 'Minimal Doc',
      name: 'Minimal Doc',
      desc: 'Clean editorial pacing & subtle framing',
      tag: 'Clean',
      icon: Layers,
    },
    {
      id: 'Fast Tech',
      name: 'Fast Tech',
      desc: 'Rapid glitch transitions & cyber montage',
      tag: 'Glitch',
      icon: Cpu,
    },
  ];

  return (
    <div id="vertical-accordion-stack" className="w-full flex flex-col gap-2 mb-3 select-none">
      {/* 1. PROMPT SECTION */}
      <div id="accordion-bar-prompt" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-prompt"
          onClick={() => onToggleBar('prompt')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'prompt'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <PenTool className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white shrink-0">Prompt</span>
            <span className="text-xs text-neutral-400 truncate hidden sm:inline font-mono">
              {prompt ? `"${prompt}"` : 'Enter prompt...'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono">
              {prompt.trim() ? `${prompt.length}c` : 'Empty'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'prompt' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'prompt' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800 flex flex-col gap-2.5">
            <textarea
              ref={promptTextareaRef}
              id="accordion-prompt-textarea"
              value={prompt}
              onChange={(e) => onPromptChange(e.target.value)}
              placeholder="Describe what you want to generate in pure black and white..."
              rows={3}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                id="btn-accordion-enhance-prompt"
                onClick={onEnhancePrompt}
                disabled={isEnhancingPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-neutral-200 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className={`w-3 h-3 ${isEnhancingPrompt ? 'animate-spin' : ''}`} />
                <span>{isEnhancingPrompt ? 'Enhancing...' : 'AI Enhance'}</span>
              </button>

              {prompt && (
                <button
                  type="button"
                  onClick={() => onPromptChange('')}
                  className="text-xs text-neutral-400 hover:text-white px-2 py-1 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. CATEGORY SECTION */}
      <div id="accordion-bar-category" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-category"
          onClick={() => onToggleBar('category')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'category'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Film className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Category</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.category || 'Cinematic'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'category' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'category' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = config.category.toLowerCase() === cat.id.toLowerCase();

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onUpdateConfig({ category: cat.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-xs font-medium flex-1 truncate">{cat.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. TONE SECTION (Extracted from Category) */}
      <div id="accordion-bar-tone" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-tone"
          onClick={() => onToggleBar('tone')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'tone'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Palette className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Tone</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.tone || 'Dark Dramatic'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'tone' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'tone' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {tones.map((t) => {
                const isSelected = config.tone === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateConfig({ tone: t.id })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{t.name}</div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {t.desc}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. ASPECT RATIO SECTION (Extracted from Format) */}
      <div id="accordion-bar-ratio" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-ratio"
          onClick={() => onToggleBar('ratio')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'ratio'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Crop className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Aspect Ratio</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.dimensions}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'ratio' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'ratio' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {aspectRatios.map((r) => {
                const isSelected = config.dimensions === r.id;

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onUpdateConfig({ dimensions: r.id })}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className="h-7 flex items-center justify-center">
                      <div
                        className={`border rounded-xs ${
                          isSelected ? 'border-black bg-black/20' : 'border-neutral-600 bg-neutral-900'
                        } ${r.shapeClass}`}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold">{r.name}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-neutral-700' : 'text-neutral-500'}`}>
                        {r.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. RESOLUTION SECTION (Extracted from Format) */}
      <div id="accordion-bar-resolution" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-resolution"
          onClick={() => onToggleBar('resolution')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'resolution'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Monitor className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Resolution</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.resolution.split(' ')[0]}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'resolution' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'resolution' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {resolutions.map((res) => {
                const isSelected = config.resolution === res.id;

                return (
                  <button
                    key={res.id}
                    type="button"
                    onClick={() => onUpdateConfig({ resolution: res.id })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{res.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                          }`}
                        >
                          {res.tag}
                        </span>
                      </div>
                      <div className={`text-[11px] truncate ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {res.desc}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 6. DURATION SECTION (Extracted from Format) */}
      <div id="accordion-bar-duration" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-duration"
          onClick={() => onToggleBar('duration')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'duration'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Duration</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.length}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'duration' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'duration' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {durations.map((dur) => {
                const isSelected = config.length === dur.id;

                return (
                  <button
                    key={dur.id}
                    type="button"
                    onClick={() => onUpdateConfig({ length: dur.id })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">{dur.id}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                          isSelected ? 'bg-black text-white' : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                        }`}
                      >
                        {dur.tag}
                      </span>
                    </div>
                    <div className={`text-[10px] ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      {dur.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. VOICE SECTION */}
      <div id="accordion-bar-voice" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-voice"
          onClick={() => onToggleBar('voice')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'voice'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Mic className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Voice</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.voice.split(' ')[0]}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'voice' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'voice' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {voices.map((v) => {
                const isSelected = config.voice === v.id;

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => onUpdateConfig({ voice: v.id })}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{v.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            isSelected
                              ? 'bg-black text-white'
                              : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                          }`}
                        >
                          {v.badge}
                        </span>
                      </div>
                      <div className={`text-[11px] ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                        {v.role}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 8. ACCENT SECTION (Extracted from Voice) */}
      <div id="accordion-bar-accent" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-accent"
          onClick={() => onToggleBar('accent')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'accent'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Volume2 className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Accent</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium">
              {config.speakerAccent || 'US Neutral'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'accent' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'accent' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {accents.map((acc) => {
                const isSelected = (config.speakerAccent || 'US Neutral') === acc.id;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => onUpdateConfig({ speakerAccent: acc.id })}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-semibold">{acc.name}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-neutral-700' : 'text-neutral-400'}`}>
                      {acc.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 9. STYLE SECTION (REFINED SLEEK UI) */}
      <div id="accordion-bar-style" className="w-full">
        <button
          type="button"
          id="btn-accordion-toggle-style"
          onClick={() => onToggleBar('style')}
          className={`w-full h-11 px-4 rounded-full border transition-all flex items-center justify-between text-left cursor-pointer ${
            activeBar === 'style'
              ? 'bg-neutral-900 border-white text-white shadow-xs'
              : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="text-xs font-semibold text-white">Style</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-medium truncate max-w-[140px]">
              {config.editingTemplate || 'Dynamic Shorts'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                activeBar === 'style' ? 'rotate-180 text-white' : ''
              }`}
            />
          </div>
        </button>

        {activeBar === 'style' && (
          <div className="mt-1.5 p-3.5 rounded-2xl bg-black border border-neutral-800">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {styles.map((s) => {
                const Icon = s.icon;
                const isSelected = (config.editingTemplate || 'Dynamic Shorts') === s.id;

                return (
                  <button
                    key={s.id}
                    type="button"
                    id={`btn-style-${s.id.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onUpdateConfig({ editingTemplate: s.id })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xs'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{s.name}</div>
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-neutral-700' : 'text-neutral-400'
                          }`}
                        >
                          {s.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono whitespace-nowrap ${
                          isSelected
                            ? 'bg-neutral-200 text-black font-semibold'
                            : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                        }`}
                      >
                        {s.tag}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-black shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
