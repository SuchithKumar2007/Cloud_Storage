import React, { useEffect, useState } from 'react';
import { ShieldCheck, HardDrive, Sparkles, Film, Image as ImageIcon, Music } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // milliseconds
  isLoading?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 2200,
  isLoading = false
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing MEMOPIX Vault...');
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = 30; // update every 30ms

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let pct = Math.min(Math.round((elapsed / minDuration) * 100), 100);

      // If app is still loading after min duration, hold at 96%
      if (pct >= 96 && isLoading) {
        pct = 96;
        setStatusText('Connecting to MEMOPIX Cloud...');
      } else if (pct < 30) {
        setStatusText('Initializing MEMOPIX Vault...');
      } else if (pct < 65) {
        setStatusText('Mounting 5 TB Private Storage Engine...');
      } else if (pct < 90) {
        setStatusText('Loading Photos, Unlimited Videos & Music...');
      } else {
        setStatusText('Welcome to MEMOPIX');
      }

      setProgress(pct);

      if (elapsed >= minDuration && !isLoading) {
        clearInterval(timer);
        setProgress(100);
        setStatusText('Welcome to MEMOPIX');
        setIsFadingOut(true);
        setTimeout(() => {
          setIsDone(true);
          onFinish?.();
        }, 650); // wait for fade-out animation
      }
    }, interval);

    return () => clearInterval(timer);
  }, [minDuration, isLoading, onFinish]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070A11] text-white selection:bg-brand-500 overflow-hidden transition-all duration-700 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative floating pixel/grid dots representing "PIX" */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0f_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center space-y-8">
        
        {/* Animated Brand Emblem */}
        <div className="relative group">
          {/* Pulsing ring aura */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-500 via-cyan-400 to-purple-600 opacity-30 blur-lg animate-pulse" />
          
          <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-b from-[#161F33] to-[#0D1321] border border-white/10 shadow-2xl flex items-center justify-center p-4 backdrop-blur-xl">
            <img
              src="/logo.png"
              alt="MEMOPIX Logo"
              className="w-20 h-20 object-contain drop-shadow-[0_0_20px_rgba(12,142,233,0.6)] transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Corner badge icons representing Photos, Videos, Audio */}
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 backdrop-blur-md flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
            <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
          </div>
          <div className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 backdrop-blur-md flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <Film className="w-3.5 h-3.5 text-purple-300" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-md flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <Music className="w-3.5 h-3.5 text-emerald-300" />
          </div>
        </div>

        {/* Brand Name & Typography Breakdown */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-cyan-300 backdrop-blur-md mb-1 shadow-inner">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>5 TB PRIVATE MEMORY CLOUD</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-wider uppercase font-sans">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">MEMO</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(12,142,233,0.5)]">
              PIX
            </span>
          </h1>

          <p className="text-xs text-gray-400 tracking-wide font-medium">
            Your Moments, Captured & Preserved In Full Fidelity
          </p>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-full space-y-3 pt-2">
          {/* Bar track */}
          <div className="relative w-full h-1.5 bg-gray-800/80 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <div
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-brand-500 via-cyan-400 to-purple-500 rounded-full transition-all duration-150 ease-out shadow-[0_0_12px_rgba(12,142,233,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Dynamic Status Text & Percentage */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
            <span className="truncate text-left text-gray-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              {statusText}
            </span>
            <span className="font-semibold text-cyan-400 pl-2">
              {progress}%
            </span>
          </div>
        </div>

        {/* Security / Specs Footer Badge */}
        <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 border-t border-white/5 pt-4 w-full">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-cyan-400" /> 5,000 GB Quota
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> End-to-End Vault
          </span>
          <span>•</span>
          <span>No Video Limits</span>
        </div>

      </div>
    </div>
  );
};
