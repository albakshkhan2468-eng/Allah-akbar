import React from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Shield,
  Palette,
  Clock,
  Calendar,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { AppSettings, ColorTheme } from '../types';
import { THEMES, ThemeConfig } from '../utils/theme';
import { soundFX } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  theme: ThemeConfig;
  onUpdateSettings: (updates: Partial<AppSettings>) => void;
  isWakeLockSupported: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  theme,
  onUpdateSettings,
  isWakeLockSupported,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-2xl p-5 sm:p-6 border ${theme.borderColor} bg-[#06151a] shadow-2xl max-h-[90vh] overflow-y-auto`}
        style={{ boxShadow: `0 0 35px ${theme.primaryColor}30` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: theme.primaryColor }} />
            <h3
              className="text-base font-hud font-bold tracking-wider uppercase"
              style={{ color: theme.primaryColor }}
            >
              Lock Screen & Clock Settings
            </h3>
          </div>
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* 1. Portal Title Customization */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
              Portal / Header Title
            </label>
            <input
              type="text"
              value={settings.portalTitle}
              onChange={(e) => onUpdateSettings({ portalTitle: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10f0b4]"
              placeholder="e.g. Albaksh Molsab Tuition Portal"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Appears on the top lock screen header next to the live clock.
            </p>
          </div>

          {/* 2. Color Theme Selector */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 mb-2 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
              <span>Color Glow Theme</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(THEMES).map((t) => {
                const isSelected = settings.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      soundFX.playClick();
                      onUpdateSettings({ theme: t.id });
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-white/80 bg-white/10 shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow"
                        style={{ backgroundColor: t.primaryColor }}
                      />
                      <span className="text-xs font-medium text-slate-200">
                        {t.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20"
                        style={{ color: t.primaryColor }}
                      >
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Screen Wake Lock (Always-on Display) */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold font-mono text-slate-200">
                  Keep Screen Awake (Live Lock Screen)
                </div>
                <div className="text-[11px] text-slate-400">
                  Prevents the mobile or PC screen from turning off or sleeping while running.
                </div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.screenWakeLock}
              onChange={(e) => {
                soundFX.playClick();
                onUpdateSettings({ screenWakeLock: e.target.checked });
              }}
              className="w-5 h-5 accent-[#10f0b4] rounded cursor-pointer"
            />
          </div>

          {/* 4. Hijri Moon Sighting Offset */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Hijri Lunar Sighting Adjuster (قمری تاریخ ایڈجسٹ)
              </label>
              <span className="text-xs font-mono text-amber-400 font-bold">
                {settings.hijriOffsetDays > 0 ? `+${settings.hijriOffsetDays}` : settings.hijriOffsetDays} Days
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[-2, -1, 0, 1, 2].map((offset) => (
                <button
                  key={offset}
                  onClick={() => {
                    soundFX.playClick();
                    onUpdateSettings({ hijriOffsetDays: offset });
                  }}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition ${
                    settings.hijriOffsetDays === offset
                      ? 'bg-amber-950 border-amber-500 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {offset > 0 ? `+${offset}` : offset}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Adjust if local moon sighting differs by a day.
            </p>
          </div>

          {/* 5. Audio Settings */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider">
              Audio & Ticks
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
                <span className="text-xs text-slate-300">Sound Effects</span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                  className="accent-[#10f0b4]"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
                <span className="text-xs text-slate-300">Second Tick Sound</span>
                <input
                  type="checkbox"
                  checked={settings.secondTickSound}
                  onChange={(e) => onUpdateSettings({ secondTickSound: e.target.checked })}
                  className="accent-[#10f0b4]"
                />
              </label>
            </div>
          </div>

          {/* 6. Display Brightness Slider */}
          <div>
            <div className="flex items-center justify-between mb-1 text-xs font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Night / Bedside Display Brightness
              </span>
              <span>{settings.brightness}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ brightness: parseInt(e.target.value, 10) })}
              className="w-full accent-[#10f0b4] cursor-pointer"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundFX.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase text-black transition active:scale-95"
            style={{ backgroundColor: theme.primaryColor }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
