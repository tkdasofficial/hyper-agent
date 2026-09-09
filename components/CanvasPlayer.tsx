'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  Layers,
  Repeat,
  Share2,
  Check,
} from 'lucide-react';
import { GeneratedVideo, AspectRatio } from '@/lib/types';

interface CanvasPlayerProps {
  video: GeneratedVideo;
  onRegenerate: (video: GeneratedVideo) => void;
}

export const CanvasPlayer: React.FC<CanvasPlayerProps> = ({ video, onRegenerate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);

  const duration = video.durationSeconds || 15;

  // Aspect ratio class mapping
  const getAspectClass = (dimensions: AspectRatio) => {
    switch (dimensions) {
      case '9:16':
        return 'aspect-[9/16] max-h-[64vh] max-w-sm';
      case '1:1':
        return 'aspect-square max-h-[58vh] max-w-lg';
      case '4:5':
        return 'aspect-[4/5] max-h-[60vh] max-w-md';
      case '21:9':
        return 'aspect-[21/9] max-h-[55vh] max-w-5xl';
      case '16:9':
      default:
        return 'aspect-[16/9] max-h-[60vh] max-w-4xl';
    }
  };

  // Web Audio Synth setup for ambient cinematic sound
  const initAudio = () => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A sub drone

      gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      audioCtxRef.current = ctx;
      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // AudioContext not allowed before user interaction
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    initAudio();
    if (gainNodeRef.current && audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      const newMute = !isMuted;
      setIsMuted(newMute);
      gainNodeRef.current.gain.setValueAtTime(newMute ? 0 : 0.08, audioCtxRef.current.currentTime);
    } else {
      setIsMuted(!isMuted);
    }
  };

  // Format time (00:07)
  const formatTime = (secs: number) => {
    const s = Math.floor(secs);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Timeline scrubber
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    currentTimeRef.current = val;
    setCurrentTime(val);
  };

  // Toggle play/pause
  const togglePlay = () => {
    initAudio();
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    setIsPlaying((prev) => !prev);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Mouse hover visibility for overlay controls
  const handleMouseMove = () => {
    setControlsVisible(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 2800);
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localTime = currentTimeRef.current;
    lastTimeRef.current = performance.now();

    const render = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (isPlaying) {
        localTime += delta;
        if (localTime >= duration) {
          if (isLooping) {
            localTime = 0;
          } else {
            localTime = duration;
            setIsPlaying(false);
          }
        }
        currentTimeRef.current = localTime;
        setCurrentTime(localTime);
      } else {
        localTime = currentTimeRef.current;
      }

      // Drawing to canvas
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) return;

      const progress = localTime / duration;
      const seed = video.seed || 42;

      // 1. Background: Deep obsidian black
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle grid floor / horizon perspective lines
      ctx.save();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 1;
      const horizonY = height * 0.58;
      const centerX = width * 0.5;

      // Draw perspective rays
      const rays = 18;
      for (let i = -rays / 2; i <= rays / 2; i++) {
        const xOffset = i * (width / (rays * 0.45));
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(centerX + xOffset * 2.2, height);
        ctx.stroke();
      }

      // Draw moving horizontal depth lines
      const speed = (localTime * 40) % 60;
      for (let y = horizonY; y < height; y += 18) {
        const effectiveY = y + speed * ((y - horizonY) / (height - horizonY));
        if (effectiveY < height && effectiveY >= horizonY) {
          ctx.beginPath();
          ctx.moveTo(0, effectiveY);
          ctx.lineTo(width, effectiveY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. Central Cinematic Subject based on Style Mode
      ctx.save();
      const animT = localTime * 0.8;

      if (video.styleMode === 'cyber') {
        // High-tech kinetic wireframe cube & glowing glyphs
        const cubeSize = Math.min(width, height) * 0.28;
        const angle = animT;
        ctx.translate(centerX, horizonY - 40);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10;

        // Rotating wireframe geometry
        for (let r = 0; r < 3; r++) {
          ctx.save();
          ctx.rotate(angle + (r * Math.PI) / 3);
          ctx.strokeRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);
          ctx.restore();
        }

        // Inner glowing core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 6 + Math.sin(animT * 4) * 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (video.styleMode === 'commercial') {
        // Polished luxury circular chronometer/disk with metallic highlights
        const radius = Math.min(width, height) * 0.24;
        ctx.translate(centerX, horizonY - 30);

        // Concentric precision dials
        ctx.strokeStyle = '#52525b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
        ctx.stroke();

        // Moving hands / orbital ticks
        const handAngle = animT * 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(handAngle) * radius * 0.65, Math.sin(handAngle) * radius * 0.65);
        ctx.stroke();

        // Specular sweep highlight
        const sweepGrad = ctx.createLinearGradient(
          -radius + Math.sin(animT) * radius,
          -radius,
          radius,
          radius
        );
        sweepGrad.addColorStop(0, 'rgba(255,255,255,0)');
        sweepGrad.addColorStop(0.5, 'rgba(255,255,255,0.25)');
        sweepGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sweepGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
        ctx.fill();
      } else if (video.styleMode === 'scifi') {
        // Gravitational lens / accretion rings
        ctx.translate(centerX, horizonY - 40);
        const radius = Math.min(width, height) * 0.28;

        // Dark singularity center
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        // Glowing white rim
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
        ctx.stroke();

        // Tilted particle ellipses
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius, radius * 0.3, Math.sin(animT * 0.5) * 0.2 + 0.3, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Noir / Default: Brutalist monoliths with stark lighting
        const monolithW = Math.min(width, height) * 0.2;
        const monolithH = Math.min(width, height) * 0.38;
        ctx.translate(centerX, horizonY - monolithH * 0.5);

        // Floating monolith with slow vertical hover
        const hoverY = Math.sin(animT * 1.5) * 8;
        ctx.translate(0, hoverY);

        // Facet A (Light)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -monolithH * 0.5);
        ctx.lineTo(monolithW * 0.5, 0);
        ctx.lineTo(0, monolithH * 0.5);
        ctx.lineTo(-monolithW * 0.5, 0);
        ctx.closePath();
        ctx.fill();

        // Facet B (Shadow / Chiaroscuro)
        ctx.fillStyle = '#27272a';
        ctx.beginPath();
        ctx.moveTo(0, -monolithH * 0.5);
        ctx.lineTo(monolithW * 0.5, 0);
        ctx.lineTo(0, monolithH * 0.5);
        ctx.closePath();
        ctx.fill();

        // High contrast outline
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isLooping, video, duration]);

  // Adjust canvas pixel resolution to container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          canvas.width = Math.floor(width * window.devicePixelRatio);
          canvas.height = Math.floor(height * window.devicePixelRatio);
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [video.config.dimensions]);

  // Download video / capture frame
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDownloading(true);

    try {
      // Create high-res snapshot PNG + Metadata JSON export
      const imageUri = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imageUri;
      a.download = `hyper-agent-${video.title.toLowerCase().replace(/\s+/g, '-')}-${video.config.dimensions}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      id="active-canvas-player"
      onMouseMove={handleMouseMove}
      onClick={togglePlay}
      className={`
        relative w-full mx-auto rounded-xl overflow-hidden
        border border-neutral-800 bg-[#050505]
        shadow-2xl select-none group cursor-pointer
        transition-all duration-300
        ${getAspectClass(video.config.dimensions)}
      `}
    >
      {/* HTML5 Canvas rendering target */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block object-contain pointer-events-none"
      />

      {/* TOP OVERLAY: Video Title & Action Buttons */}
      <div
        className={`
          absolute top-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between
          bg-gradient-to-b from-black/80 via-black/30 to-transparent
          transition-opacity duration-300
          ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Left: Title & Aspect Badge */}
        <div className="flex items-center gap-2 max-w-[65%]">
          <h3 className="text-xs sm:text-sm font-semibold text-white truncate tracking-wide">
            {video.title}
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900/80 text-neutral-300">
            {video.config.dimensions}
          </span>
        </div>

        {/* Top-Right: Regenerate & Download buttons */}
        <div className="flex items-center gap-2">
          {/* Regenerate Button */}
          <button
            id="btn-canvas-regenerate"
            onClick={(e) => {
              e.stopPropagation();
              onRegenerate(video);
            }}
            title="Regenerate video"
            className="p-1.5 rounded-md bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-colors focus:outline-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Download Button */}
          <button
            id="btn-canvas-download"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            title="Export video frame"
            className="px-2.5 py-1 rounded-md bg-white text-black hover:bg-neutral-200 transition-colors focus:outline-none flex items-center gap-1 text-xs font-medium"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-black" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-black" />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CENTER OVERLAY: Play / Pause toggle button */}
      <div
        className={`
          absolute inset-0 flex items-center justify-center pointer-events-none
          transition-opacity duration-200
          ${!isPlaying || controlsVisible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <button
          id="btn-canvas-center-play-pause"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className={`
            pointer-events-auto p-4 sm:p-5 rounded-full
            bg-black/70 hover:bg-black/90 text-white
            border border-neutral-700 hover:border-white
            transition-all transform active:scale-90 shadow-2xl backdrop-blur-sm
            ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100 scale-105'}
          `}
          title={isPlaying ? 'Pause video' : 'Play video'}
        >
          {isPlaying ? (
            <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
          ) : (
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* BOTTOM OVERLAY: Minimalistic Video Progress Bar & Controls */}
      <div
        className={`
          absolute bottom-0 inset-x-0 p-3 sm:p-4
          bg-gradient-to-t from-black/90 via-black/50 to-transparent
          transition-opacity duration-300
          ${controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrubber Progress Bar */}
        <div className="relative group/scrubber w-full mb-2">
          {/* Background track */}
          <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden relative group-hover/scrubber:h-1.5 transition-all">
            {/* Buffered track */}
            <div className="absolute inset-0 w-full bg-neutral-700/40" />
            {/* Playhead progress */}
            <div
              className="h-full bg-white relative transition-all"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Invisible interactive input range */}
          <input
            id="video-timeline-scrubber"
            type="range"
            min={0}
            max={duration}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="absolute -top-2 inset-x-0 w-full h-5 opacity-0 cursor-pointer z-20"
            title="Scrub video timeline"
          />
        </div>

        {/* Minimal Bottom Controls Row */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
          {/* Left: Timecode */}
          <div className="flex items-center gap-2 text-white">
            <span>{formatTime(currentTime)}</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400">{formatTime(duration)}</span>
          </div>

          {/* Right: Audio toggle, Loop, Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Sound toggle */}
            <button
              id="btn-canvas-audio-toggle"
              onClick={toggleSound}
              className="p-1 hover:text-white transition-colors"
              title={isMuted ? 'Unmute atmospheric audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-white" />}
            </button>

            {/* Loop toggle */}
            <button
              id="btn-canvas-loop-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setIsLooping(!isLooping);
              }}
              className={`p-1 transition-colors ${isLooping ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
              title={isLooping ? 'Looping enabled' : 'Looping disabled'}
            >
              <Repeat className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle */}
            <button
              id="btn-canvas-fullscreen-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              className="p-1 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
