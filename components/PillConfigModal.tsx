'use client';

import React from 'react';
import {
  X,
  Check,
  Clock,
  Tv,
  Gauge,
  Activity,
  Layers,
  Mic,
  Palette,
  Maximize,
} from 'lucide-react';
import { VideoConfig, AspectRatio } from '@/lib/types';

export type ConfigPillType =
  | 'length'
  | 'resolution'
  | 'fps'
  | 'bitrate'
  | 'category'
  | 'voice'
  | 'tone'
  | 'dimensions';

interface PillConfigModalProps {
  pillType: ConfigPillType | null;
  config: VideoConfig;
  onClose: () => void;
  onUpdateConfig: (newConfig: Partial<VideoConfig>) => void;
}

interface OptionItem {
  value: string;
  label: string;
}

export const PillConfigModal: React.FC<PillConfigModalProps> = ({
  pillType,
  config,
  onClose,
  onUpdateConfig,
}) => {
  if (!pillType) return null;

  const getPillData = (): {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    options: OptionItem[];
  } => {
    switch (pillType) {
      case 'length':
        return {
          title: 'Length',
          icon: Clock,
          options: [
            { value: '5s', label: '5s' },
            { value: '10s', label: '10s' },
            { value: '15s', label: '15s' },
            { value: '30s', label: '30s' },
            { value: '60s', label: '60s' },
          ],
        };
      case 'resolution':
        return {
          title: 'Resolution',
          icon: Tv,
          options: [
            { value: '720p HD', label: '720p HD' },
            { value: '1080p FHD', label: '1080p FHD' },
            { value: '2K QHD', label: '2K QHD' },
            { value: '4K UHD', label: '4K UHD' },
          ],
        };
      case 'fps':
        return {
          title: 'Frame Rate',
          icon: Gauge,
          options: [
            { value: '24 fps', label: '24 fps' },
            { value: '30 fps', label: '30 fps' },
            { value: '60 fps', label: '60 fps' },
          ],
        };
      case 'bitrate':
        return {
          title: 'Bitrate',
          icon: Activity,
          options: [
            { value: '8 Mbps', label: '8 Mbps' },
            { value: '16 Mbps', label: '16 Mbps' },
            { value: '32 Mbps High', label: '32 Mbps' },
            { value: '64 Mbps Master', label: '64 Mbps' },
          ],
        };
      case 'category':
        return {
          title: 'Category',
          icon: Layers,
          options: [
            { value: 'Cinematic', label: 'Cinematic' },
            { value: 'Commercial', label: 'Commercial' },
            { value: 'Sci-Fi', label: 'Sci-Fi' },
            { value: 'Documentary', label: 'Documentary' },
            { value: 'Social Short', label: 'Social Short' },
            { value: 'Anime / Manga', label: 'Anime / Manga' },
          ],
        };
      case 'voice':
        return {
          title: 'Voiceover',
          icon: Mic,
          options: [
            { value: 'Echo Deep Male', label: 'Echo (Deep Male)' },
            { value: 'Nova Studio Host', label: 'Nova (Warm Host)' },
            { value: 'Aria Cinematic', label: 'Aria (Female)' },
            { value: 'Synth Cyber AI', label: 'Synth (Cyber AI)' },
            { value: 'None', label: 'None (Ambient Only)' },
          ],
        };
      case 'tone':
        return {
          title: 'Tone',
          icon: Palette,
          options: [
            { value: 'Dark Dramatic', label: 'Dark Dramatic' },
            { value: 'Minimalist Clean', label: 'Minimalist Clean' },
            { value: 'Cyberpunk', label: 'Cyberpunk' },
            { value: 'Atmospheric', label: 'Atmospheric' },
            { value: 'High-Energy Fast', label: 'High-Energy Fast' },
          ],
        };
      case 'dimensions':
        return {
          title: 'Dimensions',
          icon: Maximize,
          options: [
            { value: '16:9', label: '16:9 (Landscape)' },
            { value: '9:16', label: '9:16 (Vertical)' },
            { value: '1:1', label: '1:1 (Square)' },
            { value: '4:5', label: '4:5 (Portrait)' },
            { value: '21:9', label: '21:9 (CinemaScope)' },
          ],
        };
    }
  };

  const { title, icon: Icon, options } = getPillData();
  const currentValue = config[pillType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100 select-none"
      onClick={onClose}
    >
      <div
        id="pill-config-modal-content"
        className="w-full max-w-xs bg-[#0e0e11] border border-neutral-800 rounded-xl shadow-2xl p-3 text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title & Icon & Close */}
        <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-neutral-800 px-1">
          <div className="flex items-center gap-2">
            <Icon className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-xs font-semibold tracking-wide text-white">
              {title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Short Options List Only */}
        <div className="space-y-1">
          {options.map((opt) => {
            const isSelected = currentValue === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => {
                  if (pillType === 'dimensions') {
                    onUpdateConfig({ dimensions: opt.value as AspectRatio });
                  } else {
                    onUpdateConfig({ [pillType]: opt.value });
                  }
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors text-left
                  ${
                    isSelected
                      ? 'bg-neutral-800 text-white font-medium'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }
                `}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
