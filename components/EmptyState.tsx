'use client';

import React from 'react';
import { Film, ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string, suggestedAspectRatio?: '16:9' | '9:16' | '1:1' | '21:9') => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const sampleSuggestions: {
    label: string;
    text: string;
    ratio: '16:9' | '9:16' | '1:1' | '21:9';
  }[] = [
    {
      label: 'Cinematic mountain fog',
      text: 'Slow cinematic drone flythrough of a brutalist concrete monolith in mountain fog with high-contrast lighting',
      ratio: '21:9',
    },
    {
      label: 'Cyberpunk kinetic reel',
      text: 'Kinetic neon typography transitioning into hyper-detailed robotic assembly in high contrast',
      ratio: '9:16',
    },
    {
      label: 'Macro mechanical watch',
      text: 'Extreme macro slider shot across mechanical watch movement with mirror-finish gears and reflections',
      ratio: '1:1',
    },
    {
      label: 'Deep space gravitational lens',
      text: 'Volumetric particle accretion disk warping spacetime with relativistic jets and distant stellar dust',
      ratio: '16:9',
    },
  ];

  return (
    <div
      id="canvas-empty-state"
      className="w-full h-full flex flex-col items-center justify-center text-center px-4 py-12 select-none"
    >
      <div className="max-w-md flex flex-col items-center">
        {/* Clean Studio Icon */}
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white mb-4 shadow-sm">
          <Film className="w-5 h-5 text-neutral-300" />
        </div>

        {/* Heading & Subtitle */}
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white mb-1.5">
          Create Your Video
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed mb-6">
          Describe the scene below to autonomously compose, direct, and generate video.
        </p>

        {/* Clean Suggestions Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg">
          {sampleSuggestions.map((item, idx) => (
            <button
              key={idx}
              id={`sample-prompt-${idx}`}
              onClick={() => onSelectPrompt(item.text, item.ratio)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-all group"
            >
              <span>{item.label}</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

