export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '21:9';

export interface VideoConfig {
  length: string; // e.g. '15s', '30s', '60s'
  resolution: string; // e.g. '1080p FHD', '4K UHD', '720p HD'
  fps: string; // e.g. '24 fps', '30 fps', '60 fps'
  bitrate: string; // e.g. '16 Mbps', '32 Mbps High', '64 Mbps'
  category: string; // e.g. 'Cinematic', 'Commercial', 'Documentary', 'Sci-Fi'
  voice: string; // e.g. 'Echo Deep Male', 'Nova Studio Host', 'None'
  tone: string; // e.g. 'Dark Dramatic', 'Minimalist Clean', 'Cyberpunk'
  dimensions: AspectRatio; // '16:9', '9:16', etc.
  editingTemplate?: string; // 'Dynamic Shorts', 'Cinematic Suspense', 'Minimal Doc', 'Fast Tech'
  speakerAccent?: string; // 'US Neutral', 'British RP', 'Nordic Noir', etc.
}

export interface StoryboardBeat {
  timestamp: string;
  visual: string;
  camera: string;
  audio: string;
}

export interface GeneratedVideo {
  id: string;
  title: string;
  prompt: string;
  config: VideoConfig;
  createdAt: string;
  durationSeconds: number;
  cameraMovement: string;
  lightingSetup: string;
  voiceoverScript: string;
  soundDesign: string;
  beats: StoryboardBeat[];
  seed: number;
  styleMode: 'noir' | 'scifi' | 'commercial' | 'minimal' | 'cyber';
  views?: number;
  tags: string[];
}

export interface WorkflowPipeline {
  id: string;
  name: string;
  cron: string;
  cronHuman: string;
  description: string;
  status: 'active' | 'paused' | 'running';
  lastRun: string;
  nextRun: string;
  targetPlatform: ('youtube' | 'facebook' | 'instagram')[];
  pipelineSteps: string[];
}

export interface IntegrationAccount {
  id: 'youtube' | 'facebook' | 'instagram' | 'supabase';
  name: string;
  accountHandle: string;
  status: 'connected' | 'disconnected' | 'pending';
  channelInfo: string;
  autoPublish: boolean;
  resolutionPreset: string;
  lastSync: string;
}
