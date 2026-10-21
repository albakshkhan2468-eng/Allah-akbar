import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  Power,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { ThemeConfig } from '../utils/theme';
import { Task, AppSettings } from '../types';
import { HijriDateInfo } from '../utils/dateUtils';
import { generateLockscreenWallpaper } from '../utils/wallpaperGenerator';
import { soundFX } from '../utils/audio';

interface LockScreenSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  portalTitle: string;
  hijriDate: HijriDateInfo;
  currentDate: Date;
  tasks: Task[];
  settings: AppSettings;
  timeStr: string;
  secondsStr: string;
  dateStr: string;
  onActivateWakeLock: () => void;
  onToggleFullscreen: () => void;
}

export const LockScreenSetupModal: React.FC<LockScreenSetupModalProps> = ({
  isOpen,
  onClose,
  theme,
  portalTitle,
  hijriDate,
  currentDate,
  tasks,
  settings,
  timeStr,
  secondsStr,
  dateStr,
  onActivateWakeLock,
  onToggleFullscreen,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadWallpaper = async () => {
    setIsGenerating(true);
    soundFX.playClick();
    try {
      const dataUrl = await generateLockscreenWallpaper({
        theme,
        portalTitle,
        hijriDate,
        currentDate,
        tasks,
        is24Hour: settings.is24Hour,
        timeStr,
        secondsStr,
        dateStr,
      });

      setPreviewDataUrl(dataUrl);

      // Trigger instant file download for mobile / PC gallery
      const link = document.createElement('a');
      link.download = `LockScreen_${portalTitle.replace(/\s+/g, '_')}_${dateStr.replace(/\s+/g, '')}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      soundFX.playTaskComplete();
    } catch (err) {
      console.error('Failed to generate lockscreen wallpaper:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-2xl p-5 sm:p-6 border ${theme.borderColor} bg-[#061419] shadow-2xl max-h-[92vh] overflow-y-auto`}
        style={{ boxShadow: `0 0 40px ${theme.primaryColor}35` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <div>
              <h3
                className="text-sm sm:text-base font-hud font-bold tracking-wider uppercase"
                style={{ color: theme.primaryColor }}
              >
                Set on Mobile Lock Screen (لاک اسکرین گائیڈ)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Power button dabane par yahi digital clock aur tasks kaise dekhein?
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Honest Technical Explanation & 3 Easy Options */}
        <div className="space-y-4">
          {/* Method 1: Download HD Lock Screen Wallpaper */}
          <div
            className="p-4 rounded-xl border transition-all"
            style={{
              borderColor: `${theme.primaryColor}70`,
              backgroundColor: `${theme.primaryColor}0d`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  1
                </span>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  1-Click HD Lock Screen Wallpaper (سب سے بہترین طریقہ)
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                Recommended
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Neeche button dabakar aapki <strong>chamakne wali Digital Clock</strong>,{' '}
              <strong>{portalTitle}</strong>, <strong>ہجری تاریخ ({hijriDate.formattedUrdu})</strong>, aur{' '}
              <strong>aaj ke daily tasks</strong> ka high-resolution (HD 1080x2400) Wallpaper download karein.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadWallpaper}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-black transition active:scale-95 shadow-lg"
                style={{
                  backgroundColor: theme.primaryColor,
                  boxShadow: `0 0 15px ${theme.primaryColor}66`,
                }}
              >
                <Download className="w-4 h-4" />
                <span>
                  {isGenerating ? 'HD Wallpaper Ban raha hai...' : 'Download HD Lock Screen Wallpaper'}
                </span>
              </button>

              {downloadSuccess && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Gallery mein download ho gaya!
                </span>
              )}
            </div>

            {/* Quick 2-step guide */}
            <div className="mt-3 p-3 rounded-lg bg-black/40 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <div className="font-bold text-amber-400">📲 Wallpaper lagane ka aasan tareeqa:</div>
              <div>1. Phone ki <strong>Gallery / Photos</strong> kholein aur download hui photo open karein.</div>
              <div>2. 3 dots menu dabayein aur <strong>"Set as Lock Screen Wallpaper"</strong> select karein.</div>
              <div className="text-emerald-300">
                ✨ Ab aap jab bhi phone ka <strong>Power Button</strong> dabayenge, lock screen par yahi digital time aur tasks dikhenge!
              </div>
            </div>
          </div>

          {/* Method 2: Live Desk Standby / Always-On Display (AOD) */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-300">
                2
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Live Desk Standby / Always-On Display (AOD)
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Agar aap mobile ko table, stand, ya charging dock par rakhte hain, toh power button dabane ki zaroorat hi nahi!{' '}
              <strong>"Keep Screen Awake"</strong> aur <strong>"Fullscreen"</strong> on karke rakhein — phone ki screen kabhi off nahi hogi aur har second live ticking clock aur updated tasks samne rahenge.
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  soundFX.playClick();
                  onActivateWakeLock();
                  onToggleFullscreen();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono font-bold text-slate-200 hover:text-white hover:border-[#10f0b4] transition"
              >
                <Power className="w-3.5 h-3.5 text-emerald-400" />
                <span>Start Live Standby Fullscreen Mode</span>
              </button>
            </div>
          </div>

          {/* Method 3: Lock Screen Shortcut / PWA */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-300">
                3
              </span>
              <h4 className="text-sm font-bold text-white tracking-wide">
                Phone Lock Screen Shortcut (1-Swipe Launch)
              </h4>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Android (Samsung, Xiaomi, Vivo, Oppo) phones mein:{' '}
              <span className="text-slate-200">
                <strong>Settings ➔ Lock screen ➔ Shortcuts</strong>
              </span>{' '}
              mein jakar is app ka shortcut lock screen ke bottom corner par laga sakte hain. Power button dabate hi swipe karke bina unlock kiye ye live clock aur tasks khul jayenge.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase text-black"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Close / Samajh Gaya
          </button>
        </div>
      </div>
    </div>
  );
};
