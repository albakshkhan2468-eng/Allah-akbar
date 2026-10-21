import React from 'react';
import { Sparkles } from 'lucide-react';
import { ThemeConfig } from '../utils/theme';

interface CalendarCardProps {
  theme: ThemeConfig;
  day: string;
  month: string;
  year: string;
}

export const CalendarCard: React.FC<CalendarCardProps> = ({
  theme,
  day,
  month,
  year,
}) => {
  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border ${theme.borderColor} ${theme.cardBg} transition-all duration-300 relative overflow-hidden`}
      style={{
        boxShadow: theme.glowShadow,
      }}
    >
      {/* Background glow */}
      <div
        className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: theme.amberColor }}
      />

      {/* Card Header: ✨ SHINING DIGITAL CALENDAR + LIVE */}
      <div className="flex items-center justify-between gap-2 mb-3 select-none">
        <div className="flex items-center gap-2">
          <Sparkles
            className="w-4 h-4 animate-spin"
            style={{ color: theme.primaryColor, animationDuration: '8s' }}
          />
          <h2
            className="text-xs sm:text-sm font-hud font-bold tracking-wider uppercase"
            style={{ color: theme.primaryColor }}
          >
            SHINING DIGITAL CALENDAR
          </h2>
        </div>

        {/* LIVE pill badge with pulsing dot */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-wider"
          style={{
            borderColor: `${theme.primaryColor}80`,
            backgroundColor: `${theme.primaryColor}18`,
            color: theme.primaryColor,
            boxShadow: `0 0 10px ${theme.primaryColor}25`,
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <span>LIVE</span>
        </div>
      </div>

      {/* Inner Glowing Box for Gregorian Date */}
      <div
        className={`relative rounded-xl p-3.5 sm:p-4 border transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${theme.innerBg}`}
        style={{
          borderColor: `${theme.amberColor}60`,
          boxShadow: `0 0 20px ${theme.amberColor}18, inset 0 0 12px ${theme.amberColor}0c`,
        }}
      >
        {/* Subtle shine sweep light across date */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-200/10 to-transparent -skew-x-25 animate-shine-sweep" />
        </div>

        {/* Format Specifier: DATE : DD . MM . YYYY */}
        <div className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-slate-400 mb-1 uppercase select-none">
          DATE : DD . MM . YYYY
        </div>

        {/* Date Digits: e.g. 21 . 10 . 2026 */}
        <div className="flex items-center justify-center gap-2 font-digital text-3xl sm:text-4xl md:text-5xl font-extrabold text-glow-amber">
          <span style={{ color: theme.amberColor }}>{day}</span>
          <span className="opacity-80" style={{ color: theme.amberColor }}>
            .
          </span>
          <span style={{ color: theme.amberColor }}>{month}</span>
          <span className="opacity-80" style={{ color: theme.amberColor }}>
            .
          </span>
          <span style={{ color: theme.amberColor }}>{year}</span>
        </div>
      </div>
    </div>
  );
};
