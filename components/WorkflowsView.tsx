'use client';

import React, { useState } from 'react';
import {
  Workflow,
  Clock,
  Play,
  Pause,
  Plus,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Layers,
  ChevronRight,
  Share2,
  Calendar,
  Sparkles,
  RotateCw,
} from 'lucide-react';
import { WorkflowPipeline } from '@/lib/types';

interface WorkflowsViewProps {
  initialWorkflows: WorkflowPipeline[];
}

export const WorkflowsView: React.FC<WorkflowsViewProps> = ({ initialWorkflows }) => {
  const [workflows, setWorkflows] = useState<WorkflowPipeline[]>(initialWorkflows);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCron, setNewCron] = useState('0 12 * * *');
  const [newDesc, setNewDesc] = useState('');

  const handleRunNow = (id: string) => {
    setRunningId(id);
    setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === id
            ? { ...wf, lastRun: 'Just now (Success)', status: 'active' }
            : wf
        )
      );
      setRunningId(null);
    }, 2200);
  };

  const toggleStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((wf) => {
        if (wf.id !== id) return wf;
        const newStatus = wf.status === 'active' ? 'paused' : 'active';
        return { ...wf, status: newStatus };
      })
    );
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newPipeline: WorkflowPipeline = {
      id: `wf-custom-${Date.now()}`,
      name: newTitle.trim(),
      cron: newCron || '0 12 * * *',
      cronHuman: 'Scheduled cron trigger',
      description: newDesc || 'Autonomous AI video synthesis and automated publishing pipeline.',
      status: 'active',
      lastRun: 'Never',
      nextRun: 'Next cron tick',
      targetPlatform: ['youtube', 'instagram'],
      pipelineSteps: [
        'Data Source & Trend Ingestion',
        'Autonomous Prompt & Script Generation',
        'Veo Video Synthesis & Color Grading',
        'Cross-Platform Auto-Dispatch',
      ],
    };

    setWorkflows([newPipeline, ...workflows]);
    setNewTitle('');
    setNewDesc('');
    setShowNewModal(false);
  };

  return (
    <div id="workflows-page-container" className="max-w-6xl mx-auto px-4 py-5 pb-28 text-white select-none">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end mb-4">
        <button
          id="btn-create-workflow"
          onClick={() => setShowNewModal(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Pipelines List */}
      <div className="space-y-3">
        {workflows.map((wf) => {
          const isRunning = runningId === wf.id;

          return (
            <div
              key={wf.id}
              id={`workflow-item-${wf.id}`}
              className="rounded-xl border border-neutral-800 bg-[#0e0e11] hover:border-neutral-700 transition-colors p-4"
            >
              {/* Row: Title, Description, Cron, Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-white mt-0.5">
                    <Workflow className="w-4 h-4 text-neutral-300" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white tracking-wide">
                        {wf.name}
                      </h3>
                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                          wf.status === 'active'
                            ? 'bg-neutral-900 text-white border border-neutral-700'
                            : wf.status === 'running'
                            ? 'bg-white text-black font-medium'
                            : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                        }`}
                      >
                        {wf.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed max-w-xl">
                      {wf.description}
                    </p>
                  </div>
                </div>

                {/* Actions & Cron info */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {/* Cron Badge */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-neutral-300">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>{wf.cronHuman}</span>
                  </div>

                  {/* Trigger Run Button */}
                  <button
                    onClick={() => handleRunNow(wf.id)}
                    disabled={isRunning}
                    className="px-2.5 py-1 rounded-md bg-white text-black hover:bg-neutral-200 text-xs font-medium flex items-center gap-1 transition-colors disabled:opacity-50"
                    title="Run workflow now"
                  >
                    <RotateCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
                    <span>{isRunning ? 'Running' : 'Run'}</span>
                  </button>

                  {/* Pause / Resume toggle */}
                  <button
                    onClick={() => toggleStatus(wf.id)}
                    className="p-1 rounded-md border border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-white transition-colors"
                    title={wf.status === 'active' ? 'Pause workflow' : 'Resume workflow'}
                  >
                    {wf.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Workflow Modal */}
      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowNewModal(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0e0e11] border border-[#27272a] rounded-xl p-6 shadow-2xl text-white select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
              <h3 className="text-sm font-semibold">New Workflow</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">Pipeline Name</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Daily Tech Trend Reels Generator"
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">
                  Cron Trigger Expression (e.g. 0 9 * * *)
                </label>
                <input
                  type="text"
                  required
                  value={newCron}
                  onChange={(e) => setNewCron(e.target.value)}
                  placeholder="0 9 * * *"
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-300 mb-1">Description & Pipeline Goal</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specify target audience, content themes, or data feeds to monitor..."
                  className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 rounded text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Deploy Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
