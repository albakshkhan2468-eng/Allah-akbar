export interface Task {
  id: string;
  title: string;
  time?: string;
  category: 'tuition' | 'study' | 'prayer' | 'personal' | 'important';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
}

export type ColorTheme = 'cyber-teal' | 'solar-gold' | 'neon-purple' | 'ice-blue' | 'stealth-dark';

export interface AppSettings {
  portalTitle: string;
  is24Hour: boolean;
  theme: ColorTheme;
  hijriOffsetDays: number;
  soundEnabled: boolean;
  secondTickSound: boolean;
  screenWakeLock: boolean;
  dimMode: boolean;
  brightness: number; // 20 - 100
  showUrduDay: boolean;
}
