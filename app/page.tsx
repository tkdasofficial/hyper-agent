'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useSession } from '@/lib/session-context';
import { AccordionStack, AccordionBarId } from '@/components/AccordionStack';
import { RecentGenerationView } from '@/components/RecentGenerationView';

export default function DashboardPage() {
  const {
    sessionVideos,
    activeVideo,
    config,
    setConfig,
    prompt,
    setPrompt,
    isGenerating,
    generatingStage,
    isEnhancingPrompt,
    handleEnhancePrompt,
    handleGenerate,
    handleRegenerate,
  } = useSession();

  // EXCLUSIVE EXPANSION: Only ONE bar open at a time
  const [activeAccordion, setActiveAccordion] = useState<AccordionBarId | null>(null);

  const handleToggleAccordion = (barId: AccordionBarId) => {
    setActiveAccordion((prev) => (prev === barId ? null : barId));
  };

  const handleMainGenerateClick = () => {
    if (isGenerating) return;

    if (!prompt.trim()) {
      setActiveAccordion('prompt');
      return;
    }

    setActiveAccordion(null);
    handleGenerate();
  };

  // Recent video is the most recently generated video in session
  const recentVideo = activeVideo || sessionVideos[0];

  return (
    <div
      id="hyper-agent-dashboard"
      className="min-h-full w-full max-w-3xl mx-auto px-3 sm:px-6 py-4 pb-24 text-white select-none flex flex-col bg-black"
    >
      {/* Dynamic Status (Only when generating - Pure B&W) */}
      {isGenerating && (
        <div className="w-full mb-3 px-4 py-2.5 rounded-full bg-neutral-900 border border-neutral-700 text-xs flex items-center justify-between text-neutral-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-white">{generatingStage || 'Rendering video frames...'}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono">Agent</span>
        </div>
      )}

      {/* Accordion Stack with pill-shaped (rounded-full) tap-to-expand buttons */}
      <AccordionStack
        activeBar={activeAccordion}
        onToggleBar={handleToggleAccordion}
        prompt={prompt}
        onPromptChange={setPrompt}
        onEnhancePrompt={handleEnhancePrompt}
        isEnhancingPrompt={isEnhancingPrompt}
        config={config}
        onUpdateConfig={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
      />

      {/* Main Action Trigger (Pill Shape: rounded-full with circular sides, Pure B&W) */}
      <div id="main-action-trigger-container" className="w-full mb-6">
        <button
          type="button"
          id="btn-generate-video-cta"
          onClick={handleMainGenerateClick}
          disabled={isGenerating}
          className={`w-full h-12 rounded-full font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 px-6 shadow-md cursor-pointer ${
            isGenerating
              ? 'bg-neutral-900 text-neutral-400 border border-neutral-800 cursor-not-allowed'
              : !prompt.trim()
              ? 'bg-black text-neutral-400 border border-neutral-800 hover:border-neutral-600 hover:text-white'
              : 'bg-white text-black hover:bg-neutral-200 border border-white active:scale-[0.99]'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Generating Video...</span>
            </>
          ) : !prompt.trim() ? (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Enter Prompt to Generate</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black fill-black" />
              <span>Generate Video</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </div>

      {/* Recent Generation Only (No Canvas/History/Queue tabs) */}
      <div id="recent-generation-container" className="w-full">
        <RecentGenerationView
          video={recentVideo}
          isGenerating={isGenerating}
          generatingStage={generatingStage}
          onRegenerate={handleRegenerate}
        />
      </div>
    </div>
  );
}
