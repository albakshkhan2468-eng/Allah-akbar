import React from 'react';
import { ThemeConfig } from '../utils/theme';

interface DigitalClockCardProps {
  theme: ThemeConfig;
  hours: string;
  minutes: string;
  seconds: string;
  ampm?: string;
  is24Hour: boolean;
}

export const DigitalClockCard: React.FC<DigitalClockCardProps> = ({
  theme,
  hours,
  minutes,
  seconds,
  ampm,
  is24Hour,
}) => {
  const secondsNum = parseInt(seconds, 10);
  const secondsPercent = (secondsNum / 60) * 100;

  return (
    <div className="w-full flex items-center justify-center gap-3 select-none">
      {/* Main Digital Clock Box (Hours : Minutes) */}
      <div
        className={`relative flex-1 max-w-[340px] rounded-2xl py-4 px-4 sm:px-6 border transition-all duration-300 overflow-hidden flex items-center justify-center ${theme.borderColor} ${theme.innerBg}`}
        style={{
          boxShadow: `0 0 24px ${theme.primaryColor}25, inset 0 0 16px ${theme.primaryColor}12`,
        }}
      >
        {/* Animated Light Sweep / Shining Effect across the numbers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-25 animate-shine-sweep" />
        </div>

        {/* Ambient background bloom */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none blur-xl"
          style={{
            background: `radial-gradient(circle at center, ${theme.primaryColor} 0%, transparent 70%)`,
          }}
        />

        {/* Big Digital Digits */}
        <div className="relative z-10 flex items-center justify-center tracking-wider">
          {/* Hours */}
          <span
            className={`font-digital text-5xl sm:text-6xl md:text-7xl font-black ${theme.primaryGlowClass}`}
            style={{ color: theme.primaryColor }}
          >
            {hours}
          </span>

          {/* Glowing Pulsing Colon */}
          <span
            className="font-digital text-4xl sm:text-5xl md:text-6xl font-bold px-2 sm:px-3 text-glow-amber animate-pulse"
            style={{ color: theme.amberColor }}
          >
            :
          </span>

          {/* Minutes */}
          <span
            className={`font-digital text-5xl sm:text-6xl md:text-7xl font-black ${theme.primaryGlowClass}`}
            style={{ color: theme.primaryColor }}
          >
            {minutes}
          </span>

          {/* 12-Hour AM/PM Indicator if active */}
          {!is24Hour && ampm && (
            <span
              className="ml-2 text-xs font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border self-start mt-2"
              style={{
                color: theme.amberColor,
                borderColor: `${theme.amberColor}60`,
                backgroundColor: `${theme.amberColor}15`,
              }}
            >
              {ampm}
            </span>
          )}
        </div>
      </div>

      {/* Seconds Box (matching screenshot: SEC 32) */}
      <div
        className={`relative rounded-2xl py-4 px-4 sm:px-5 border transition-all duration-300 flex flex-col items-center justify-center min-w-[90px] sm:min-w-[105px] overflow-hidden ${theme.innerBg}`}
        style={{
          borderColor: `${theme.amberColor}55`,
          boxShadow: `0 0 20px ${theme.amberColor}20, inset 0 0 12px ${theme.amberColor}0c`,
        }}
      >
        {/* Subtle circular progress line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${secondsPercent}%`,
              backgroundColor: theme.amberColor,
              boxShadow: `0 0 8px ${theme.amberColor}`,
            }}
          />
        </div>

        <div className="flex items-baseline gap-1.5 z-10">
          <span
            className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-70"
            style={{ color: theme.primaryColor }}
          >
            SEC
          </span>
          <span
            className="font-digital text-3xl sm:text-4xl font-extrabold text-glow-amber"
            style={{ color: theme.amberColor }}
          >
            {seconds}
          </span>
        </div>
      </div>
    </div>
  );
};
