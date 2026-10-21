import { ColorTheme } from '../types';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  primaryColor: string; // e.g. #10f0b4
  primaryGlowClass: string;
  amberColor: string;
  borderColor: string;
  cardBg: string;
  innerBg: string;
  accentText: string;
  glowShadow: string;
}

export const THEMES: Record<ColorTheme, ThemeConfig> = {
  'cyber-teal': {
    id: 'cyber-teal',
    name: 'Cyber Mint & Amber (Default)',
    primaryColor: '#10f0b4',
    primaryGlowClass: 'text-glow-cyan',
    amberColor: '#f59e0b',
    borderColor: 'border-[#10f0b4]/40 hover:border-[#10f0b4]/70',
    cardBg: 'bg-[#051317]/90',
    innerBg: 'bg-[#040e11]',
    accentText: 'text-[#10f0b4]',
    glowShadow: '0 0 25px rgba(16, 240, 180, 0.2)',
  },
  'solar-gold': {
    id: 'solar-gold',
    name: 'Solar Gold & Amber',
    primaryColor: '#fbbf24',
    primaryGlowClass: 'text-glow-amber',
    amberColor: '#f97316',
    borderColor: 'border-amber-400/40 hover:border-amber-400/70',
    cardBg: 'bg-[#150f05]/90',
    innerBg: 'bg-[#0e0a03]',
    accentText: 'text-amber-400',
    glowShadow: '0 0 25px rgba(251, 191, 36, 0.2)',
  },
  'neon-purple': {
    id: 'neon-purple',
    name: 'Neon Violet & Cyan',
    primaryColor: '#c084fc',
    primaryGlowClass: 'text-glow-purple',
    amberColor: '#38bdf8',
    borderColor: 'border-purple-400/40 hover:border-purple-400/70',
    cardBg: 'bg-[#13071b]/90',
    innerBg: 'bg-[#0d0413]',
    accentText: 'text-purple-400',
    glowShadow: '0 0 25px rgba(192, 132, 252, 0.2)',
  },
  'ice-blue': {
    id: 'ice-blue',
    name: 'Glacial Ice & Neon',
    primaryColor: '#38bdf8',
    primaryGlowClass: 'text-glow-blue',
    amberColor: '#2dd4bf',
    borderColor: 'border-sky-400/40 hover:border-sky-400/70',
    cardBg: 'bg-[#06121e]/90',
    innerBg: 'bg-[#030c14]',
    accentText: 'text-sky-400',
    glowShadow: '0 0 25px rgba(56, 189, 248, 0.2)',
  },
  'stealth-dark': {
    id: 'stealth-dark',
    name: 'OLED Pure Minimal',
    primaryColor: '#34d399',
    primaryGlowClass: 'text-glow-cyan',
    amberColor: '#e2e8f0',
    borderColor: 'border-neutral-800 hover:border-neutral-700',
    cardBg: 'bg-black/95',
    innerBg: 'bg-[#050505]',
    accentText: 'text-emerald-400',
    glowShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  },
};
