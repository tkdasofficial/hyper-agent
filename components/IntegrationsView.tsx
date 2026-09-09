'use client';

import React, { useState } from 'react';
import {
  Share2,
  CheckCircle2,
  AlertCircle,
  Key,
  Globe,
  Settings,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { IntegrationAccount } from '@/lib/types';

interface IntegrationsViewProps {
  initialIntegrations: IntegrationAccount[];
}

export const IntegrationsView: React.FC<IntegrationsViewProps> = ({
  initialIntegrations,
}) => {
  const [integrations, setIntegrations] = useState<IntegrationAccount[]>(initialIntegrations);
  const [selectedForConfig, setSelectedForConfig] = useState<IntegrationAccount | null>(null);

  const toggleAutoPublish = (id: string) => {
    setIntegrations((prev) =>
      prev.map((acc) =>
        acc.id === id ? { ...acc, autoPublish: !acc.autoPublish } : acc
      )
    );
  };

  const getPlatformIcon = (id: string) => {
    switch (id) {
      case 'supabase':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-bold text-xs tracking-tighter shadow-xs">
            SB
          </div>
        );
      case 'youtube':
        return (
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter">
            YT
          </div>
        );
      case 'instagram':
        return (
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter">
            IG
          </div>
        );
      case 'facebook':
        return (
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold text-xs tracking-tighter">
            FB
          </div>
        );
      default:
        return <Share2 className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div id="integrations-page-container" className="max-w-5xl mx-auto px-4 py-5 pb-28 text-white select-none">
      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((acc) => (
          <div
            key={acc.id}
            id={`integration-card-${acc.id}`}
            className="rounded-xl border border-neutral-800 bg-[#0e0e11] hover:border-neutral-700 transition-colors p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card top: Icon & Status */}
              <div className="flex items-start justify-between mb-4">
                {getPlatformIcon(acc.id)}

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                    acc.status === 'connected'
                      ? 'bg-neutral-900 text-white border border-neutral-700'
                      : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                  }`}
                >
                  {acc.status}
                </span>
              </div>

              {/* Title & Account */}
              <h3 className="text-sm font-semibold text-white tracking-wide mb-0.5">
                {acc.name}
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                {acc.accountHandle}
              </p>

              {/* Auto-publish toggle */}
              <div className="flex items-center justify-between p-2 rounded bg-neutral-900/60 border border-neutral-800 mb-4">
                <span className="text-xs text-neutral-300">
                  Auto-publish
                </span>
                <button
                  onClick={() => toggleAutoPublish(acc.id)}
                  className={`w-8 h-4.5 rounded-full p-0.5 transition-colors ${
                    acc.autoPublish ? 'bg-white' : 'bg-neutral-800'
                  }`}
                  title="Toggle auto-publishing"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-black transition-transform ${
                      acc.autoPublish ? 'translate-x-3.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Bottom: Sync info and config button */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
              <span className="text-[10px] text-neutral-500">
                Synced {acc.lastSync}
              </span>

              <button
                onClick={() => setSelectedForConfig(acc)}
                className="px-2 py-1 rounded border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Platform Settings */}
      {selectedForConfig && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedForConfig(null)}
        >
          <div
            className="w-full max-w-md bg-[#0e0e11] border border-[#27272a] rounded-xl p-6 shadow-2xl text-white select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h3 className="text-sm font-semibold text-white">
                {selectedForConfig.name} Configuration
              </h3>
              <button
                onClick={() => setSelectedForConfig(null)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-neutral-400 mb-1">Target Channel / Page</label>
                <input
                  type="text"
                  readOnly
                  value={selectedForConfig.accountHandle}
                  className="w-full px-3 py-2 rounded bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Default Title Pattern</label>
                <input
                  type="text"
                  defaultValue="[AI Generated] {title} • Hyper Agent"
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-neutral-400 mb-1">Autonomous Description Tags</label>
                <input
                  type="text"
                  defaultValue="#HyperAgent #AutonomousAI #AIvideo #Veo"
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-white font-mono"
                />
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedForConfig(null)}
                className="px-4 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
