'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GeneratedVideo, VideoConfig, WorkflowPipeline, IntegrationAccount, AspectRatio } from './types';
import { INITIAL_WORKFLOWS, INITIAL_INTEGRATIONS, INITIAL_LIBRARY_VIDEOS } from './initial-data';

interface SessionContextType {
  sessionVideos: GeneratedVideo[];
  activeVideoId: string;
  activeVideo: GeneratedVideo | undefined;
  setActiveVideoId: (id: string) => void;
  config: VideoConfig;
  setConfig: React.Dispatch<React.SetStateAction<VideoConfig>>;
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isGenerating: boolean;
  generatingStage: string;
  isEnhancingPrompt: boolean;
  handleEnhancePrompt: () => Promise<void>;
  handleGenerate: (customPrompt?: string, customConfig?: VideoConfig) => Promise<void>;
  handleRegenerate: (targetVideo: GeneratedVideo) => void;
  handleSelectFromLibrary: (video: GeneratedVideo) => void;
  handleSelectEmptyPrompt: (promptText: string, suggestedRatio?: AspectRatio) => void;
  handleRemoveFromSession: (id: string) => void;
  loadVideoToSettings: (video: GeneratedVideo) => void;
  workflows: WorkflowPipeline[];
  setWorkflows: React.Dispatch<React.SetStateAction<WorkflowPipeline[]>>;
  integrations: IntegrationAccount[];
  setIntegrations: React.Dispatch<React.SetStateAction<IntegrationAccount[]>>;
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const [sessionVideos, setSessionVideos] = useState<GeneratedVideo[]>([]);
  const [activeVideoId, setActiveVideoId] = useState<string>('');
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<VideoConfig>({
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

  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatingStage, setGeneratingStage] = useState<string>('');
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);

  const [workflows, setWorkflows] = useState<WorkflowPipeline[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationAccount[]>([]);

  const activeVideo = sessionVideos.find((v) => v.id === activeVideoId) || sessionVideos[0];

  const handleEnhancePrompt = async () => {
    if (isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    try {
      const base = prompt.trim() || 'A hyper-futuristic cinematic sequence';
      const enhancements = [
        `${base}, shot on ARRI Alexa 65 anamorphic lenses, volumetric cinematic fog, chiaroscuro lighting, slow axial track-in at 24fps, hyper-detailed textures, atmospheric 40Hz sound design`,
        `${base}, 35mm film grain, moody rim lighting with cool desaturated tones, deliberate camera dolly push, immersive ambient audio texture`,
        `${base}, high-speed shutter angle, kinetic match-cut typography, ultra-sharp edge contrast, crisp directional acoustics`,
      ];
      const enhanced = enhancements[Math.floor(Math.random() * enhancements.length)];
      await new Promise((r) => setTimeout(r, 600));
      setPrompt(enhanced);
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const loadVideoToSettings = (video: GeneratedVideo) => {
    setActiveVideoId(video.id);
    setPrompt(video.prompt);
    setConfig({ ...video.config });
  };

  const handleGenerate = async (customPrompt?: string, customConfig?: VideoConfig) => {
    const promptToUse = (customPrompt || prompt).trim();
    if (!promptToUse || isGenerating) return;

    const configToUse = customConfig || config;
    setIsGenerating(true);

    setGeneratingStage('Autonomous Agent: Analyzing prompt and narrative structure...');
    await new Promise((r) => setTimeout(r, 600));

    setGeneratingStage('Autonomous Agent: Synthesizing camera kinematics & lighting...');
    await new Promise((r) => setTimeout(r, 700));

    setGeneratingStage('Autonomous Agent: Compiling volumetric frames & timeline audio...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          config: configToUse,
        }),
      });

      const json = await res.json();
      const data = json.data || {};

      const durationNum = parseInt(configToUse.length) || 15;

      const newVideo: GeneratedVideo = {
        id: `gen-${Date.now()}`,
        title: data.title || 'Autonomous Composition',
        prompt: promptToUse,
        config: { ...configToUse },
        createdAt: 'Just now',
        durationSeconds: durationNum,
        cameraMovement: data.cameraMovement || 'Dynamic 35mm axial tracking shot',
        lightingSetup: data.lightingSetup || 'High-contrast monochromatic chiaroscuro',
        voiceoverScript: data.voiceoverScript || 'Autonomous vision initiated with precision.',
        soundDesign: data.soundDesign || 'Low-frequency sub rumble and atmospheric binaural drone',
        beats: data.beats || [
          { timestamp: '00:00', visual: 'Scene entrance and framing', camera: 'Push In', audio: 'Tone rise' },
          { timestamp: '00:07', visual: 'Kinetic motion expansion', camera: 'Orbit', audio: 'Sweep' },
          { timestamp: '00:14', visual: 'Stark geometric conclusion', camera: 'Lock', audio: 'Decay' },
        ],
        seed: Math.floor(Math.random() * 100000),
        styleMode: data.styleMode || 'noir',
        views: 1,
        tags: data.tags || ['HYPER', configToUse.category, configToUse.dimensions],
      };

      setSessionVideos((prev) => [newVideo, ...prev]);
      setActiveVideoId(newVideo.id);
      setPrompt('');
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
      setGeneratingStage('');
    }
  };

  const handleRegenerate = (targetVideo: GeneratedVideo) => {
    handleGenerate(targetVideo.prompt, targetVideo.config);
  };

  const handleSelectFromLibrary = (video: GeneratedVideo) => {
    if (!sessionVideos.some((v) => v.id === video.id)) {
      setSessionVideos((prev) => [video, ...prev]);
    }
    setActiveVideoId(video.id);
    router.push('/');
  };

  const handleSelectEmptyPrompt = (promptText: string, suggestedRatio?: AspectRatio) => {
    setPrompt(promptText);
    if (suggestedRatio) {
      setConfig((prev) => ({ ...prev, dimensions: suggestedRatio }));
    }
  };

  const handleRemoveFromSession = (id: string) => {
    setSessionVideos((prev) => {
      const remaining = prev.filter((v) => v.id !== id);
      if (activeVideoId === id && remaining.length > 0) {
        setActiveVideoId(remaining[0].id);
      }
      return remaining;
    });
  };

  return (
    <SessionContext.Provider
      value={{
        sessionVideos,
        activeVideoId,
        activeVideo,
        setActiveVideoId,
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
        handleSelectFromLibrary,
        handleSelectEmptyPrompt,
        handleRemoveFromSession,
        loadVideoToSettings,
        workflows,
        setWorkflows,
        integrations,
        setIntegrations,
        upgradeModalOpen,
        setUpgradeModalOpen,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
