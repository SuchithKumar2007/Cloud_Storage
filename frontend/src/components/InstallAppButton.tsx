import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Check if already in standalone app window
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install MEMOPIX as a full app:\n\n' +
        '📱 Android: Tap your browser menu (⋮) -> "Install App" or "Add to Home screen".\n' +
        '💻 Windows/Laptop: Click the Install icon in your browser address bar or menu.'
      );
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      title="Install MEMOPIX as a native app on Android, Laptop, or Windows"
      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-brand-500/15 to-purple-500/15 hover:from-brand-500/25 hover:to-purple-500/25 text-brand-600 dark:text-cyan-400 border border-brand-500/30 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
    >
      <Download className="w-3.5 h-3.5 text-cyan-400" />
      <span className="hidden sm:inline">Install App</span>
    </button>
  );
};
