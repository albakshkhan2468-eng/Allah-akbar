import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Settings,
  ShieldCheck,
  Battery,
  BatteryCharging,
  Eye,
  EyeOff,
  Edit2,
  Check,
} from 'lucide-react';
import { URDU_DAYS, HijriDateInfo } from '../utils/dateUtils';
import { ThemeConfig } from '../utils/theme';
import { soundFX } from '../utils/audio';

interface ClockHeaderProps {
  theme: ThemeConfig;
  portalTitle: string;
  onUpdatePortalTitle: (newTitle: string) => void;
  hijriDate: HijriDateInfo;
  currentDate: Date;
  is24Hour: boolean;
  onToggleTimeFormat: () => void;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSettings: () => void;
  dimMode: boolean;
  onToggleDimMode: () => void;
}

export const ClockHeader: React.FC<ClockHeaderProps> = ({
  theme,
  portalTitle,
  onUpdatePortalTitle,
  hijriDate,
  currentDate,
  is24Hour,
  onToggleTimeFormat,
  wakeLockActive,
  onToggleWakeLock,
  isFullscreen,
  onToggleFullscreen,
  onOpenSettings,
  dimMode,
  onToggleDimMode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(portalTitle);

  const dayOfWeek = currentDate.getDay();
  const dayInfo = URDU_DAYS[dayOfWeek] || URDU_DAYS[3];

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdatePortalTitle(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Top Ambient Status Bar */}
      <div className="flex items-center justify-between text-xs font-hud text-slate-400/80 px-2 select-none">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: theme.primaryColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: theme.primaryColor }}
            />
          </span>
          <span className="tracking-widest uppercase font-mono text-[10px] text-slate-300">
            LIVE LOCKSCREEN
          </span>
          {wakeLockActive && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
              <ShieldCheck className="w-2.5 h-2.5" />
              AWAKE
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* AOD / Dim Mode Toggle */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleDimMode();
            }}
            title={dimMode ? 'Exit Dim / Night Mode' : 'Dim Display for Night / Battery'}
            className="flex items-center gap-1 p-1 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition"
          >
            {dimMode ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleFullscreen();
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Lock Screen'}
            className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenSettings();
            }}
            title="Clock & Lockscreen Settings"
            className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-slate-200 transition"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Header Card (matching screenshot top block) */}
      <div
        className={`w-full rounded-2xl p-4 sm:p-5 border ${theme.borderColor} ${theme.cardBg} transition-all duration-300 relative overflow-hidden`}
        style={{
          boxShadow: theme.glowShadow,
        }}
      >
        {/* Subtle background glow */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: theme.primaryColor }}
        />

        <div className="flex items-start justify-between gap-3">
          {/* Left: Glowing Clock Icon + Titles */}
          <div className="flex items-start gap-3.5">
            {/* Glowing Icon in Rounded Square */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300"
              style={{
                borderColor: `${theme.primaryColor}88`,
                backgroundColor: `${theme.primaryColor}15`,
                boxShadow: `0 0 16px ${theme.primaryColor}40, inset 0 0 8px ${theme.primaryColor}25`,
              }}
            >
              <Clock
                className="w-5 h-5 animate-pulse"
                style={{ color: theme.primaryColor }}
              />
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col">
              <h1
                className="text-xs sm:text-sm font-hud font-bold tracking-wider uppercase"
                style={{ color: theme.primaryColor }}
              >
                OFFICIAL DIGITAL CLOCK & CALENDAR
              </h1>

              {/* Portal Title (Editable) */}
              {isEditingTitle ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                    className="bg-black/60 border border-slate-600 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-[#10f0b4]"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-1 rounded bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <p className="text-sm sm:text-base font-semibold text-slate-200 tracking-tight">
                    {portalTitle}
                  </p>
                  <span className="text-slate-500">•</span>
                  <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}

              {/* Hijri Date Display in Urdu/Arabic: e.g. جمادی الاول 1448 هجری 10 */}
              <div
                dir="rtl"
                className="mt-1 font-arabic text-sm sm:text-base font-bold tracking-wide"
                style={{ color: theme.amberColor }}
              >
                {hijriDate.formattedUrdu}
              </div>
            </div>
          </div>
        </div>

        {/* Day Pill Badge & 24H Toggle (matching screenshot pills) */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
          {/* Day Badge */}
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold tracking-wide transition-all"
            style={{
              borderColor: `${theme.primaryColor}70`,
              backgroundColor: `${theme.primaryColor}12`,
              color: theme.primaryColor,
              boxShadow: `0 0 10px ${theme.primaryColor}20`,
            }}
          >
            <span className="font-hud uppercase tracking-wider">{dayInfo.english}</span>
            <span className="opacity-60">•</span>
            <span className="font-arabic font-bold text-slate-200">
              {dayInfo.urdu} ({dayInfo.transliteration})
            </span>
          </div>

          {/* 24H / 12H Format Toggle Pill */}
          <button
            onClick={() => {
              soundFX.playClick();
              onToggleTimeFormat();
            }}
            className="px-3.5 py-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 text-xs sm:text-sm font-mono font-bold text-slate-300 hover:text-white hover:border-slate-500 transition-colors shadow-sm active:scale-95"
            title="Toggle 24-Hour / 12-Hour format"
          >
            {is24Hour ? '24H' : '12H'}
          </button>
        </div>
      </div>
    </div>
  );
};
