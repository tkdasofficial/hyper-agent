'use client';

import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Activity,
  Shuffle,
} from 'lucide-react';
import { useSession } from '@/lib/session-context';

export const DashboardStatusBar: React.FC = () => {
  const { isGenerating, generatingStage, setPrompt, setConfig } = useSession();

  const handleRandomize = () => {
    const concepts = [
      {
        prompt: 'Autonomous minimalist brutalist concrete monolith floating in mist with slow rotational drift',
        category: 'Cinematic',
        ratio: '16:9' as const,
        template: 'Cinematic Suspense',
        voice: 'Echo Deep Male',
      },
      {
        prompt: 'Kinetic cyber typography fragmenting with high-contrast motion vector particles and neon glare',
        category: 'Tech',
        ratio: '9:16' as const,
        template: 'Dynamic Shorts',
        voice: 'Synth Cyber AI',
      },
      {
        prompt: 'Eerie shadowy corridor in abandoned research bunker with flickering sodium vapor lamps',
        category: 'Horror',
        ratio: '9:16' as const,
        template: 'Cinematic Suspense',
        voice: 'Onyx Gritty',
      },
      {
        prompt: 'Precision titanium quantum processor teardown with laser cuts and ultra-macro lens flare',
        category: 'Tech',
        ratio: '16:9' as const,
        template: 'Fast Tech',
        voice: 'Alloy Neutral',
      },
    ];
    const picked = concepts[Math.floor(Math.random() * concepts.length)];
    setPrompt(picked.prompt);
    setConfig((prev) => ({
      ...prev,
      category: picked.category,
      dimensions: picked.ratio,
      editingTemplate: picked.template,
      voice: picked.voice,
    }));
  };

  const handleResetDefaults = () => {
    setConfig({
      length: '15s',
      resolution: '1080p FHD',
      fps: '24 fps',
      bitrate: '16 Mbps',
      category: 'Cinematic',
      voice: 'Echo Deep Male',
      tone: 'Dark Dramatic',
      dimensions: '9:16',
      editingTemplate: 'Dynamic Shorts',
      speakerAccent: 'US Neutral',
    });
  };

  return (
    <div
      id="dashboard-page-status-bar"
      className="w-full bg-[#0d0e12]/90 backdrop-blur-md border border-neutral-800/80 rounded-xl px-3.5 py-2.5 mb-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-sm transition-all"
    >
      {/* Left: Branding & Status Indicator */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs tracking-tight text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Hyper Agent
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono border border-neutral-700/60">
            v2.4.0 Engine
          </span>
        </div>

        {/* Worker Cluster Status */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px]">
          <span
            className={`w-2 h-2 rounded-full ${
              isGenerating ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
            }`}
          />
          <span className="text-neutral-300 font-medium">
            {isGenerating
              ? 'Render Node: Active'
              : 'Worker Cluster: 4 Nodes Ready'}
          </span>
          <span className="hidden md:inline text-neutral-500 text-[10px]">
            • 14ms latency
          </span>
        </div>
      </div>

      {/* Center: Generating Alert / Active state */}
      {isGenerating && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-300/90 font-mono truncate max-w-xs animate-pulse">
          <Activity className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{generatingStage || 'Synthesizing output...'}</span>
        </div>
      )}

      {/* Right: Quick Settings & Actions */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          id="btn-status-randomize"
          onClick={handleRandomize}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/50 transition-colors focus:outline-none"
          title="Randomize creative concept"
        >
          <Shuffle className="w-3 h-3 text-neutral-400" />
          <span>Randomize</span>
        </button>

        <button
          id="btn-status-reset"
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 transition-colors focus:outline-none"
          title="Reset configuration defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden md:inline">Reset</span>
        </button>
      </div>
    </div>
  );
};
