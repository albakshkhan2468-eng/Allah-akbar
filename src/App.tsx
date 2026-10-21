import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ClockHeader,
} from './components/ClockHeader';
import { DigitalClockCard } from './components/DigitalClockCard';
import { CalendarCard } from './components/CalendarCard';
import { DailyTasksWidget } from './components/DailyTasksWidget';
import { SettingsModal } from './components/SettingsModal';
import { LockScreenSetupModal } from './components/LockScreenSetupModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import {
  getHijriDate,
  formatGregorianDateParts,
  formatTimeParts,
} from './utils/dateUtils';
import { THEMES } from './utils/theme';
import { Task, AppSettings } from './types';
import { useWakeLock } from './hooks/useWakeLock';
import { soundFX } from './utils/audio';
import {
  Maximize,
  Moon,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const DEFAULT_SETTINGS: AppSettings = {
  portalTitle: 'Albaksh Molsab Tuition Portal',
  is24Hour: true,
  theme: 'cyber-teal',
  hijriOffsetDays: 0,
  soundEnabled: true,
  secondTickSound: false,
  screenWakeLock: true,
  dimMode: false,
  brightness: 100,
  showUrduDay: true,
};

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Fajr Prayer & Quran Recitation (صبح کا وقت)',
    time: '06:00 AM',
    category: 'prayer',
    priority: 'high',
    completed: true,
    createdAt: Date.now() - 3600000 * 5,
  },
  {
    id: 'task-2',
    title: 'Tuition Batch 1: Mathematics & Algebra Formulas',
    time: '09:30 AM',
    category: 'tuition',
    priority: 'high',
    completed: true,
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'task-3',
    title: 'Science Practical & Physics Numerical Notes Prep',
    time: '11:45 AM',
    category: 'tuition',
    priority: 'medium',
    completed: false,
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'task-4',
    title: 'Dhuhr Prayer & Lunch Break (ظہر کا وقت)',
    time: '01:30 PM',
    category: 'prayer',
    priority: 'medium',
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'task-5',
    title: 'Tuition Batch 2: Arabic Grammar & Urdu Literature',
    time: '04:30 PM',
    category: 'study',
    priority: 'high',
    completed: false,
    createdAt: Date.now() - 1800000,
  },
  {
    id: 'task-6',
    title: 'Student Attendance & Weekly Test Papers Review',
    time: '08:00 PM',
    category: 'tuition',
    priority: 'low',
    completed: false,
    createdAt: Date.now() - 600000,
  },
];

export default function App() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLockScreenModalOpen, setIsLockScreenModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitStandby, setShowExitStandby] = useState(false);

  // Settings state persisted in localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('lockscreen_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Tasks state persisted in localStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('lockscreen_tasks');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  // Screen Wake Lock Hook
  const {
    isActive: isWakeLockActive,
    isSupported: isWakeLockSupported,
    requestLock,
    releaseLock,
  } = useWakeLock();

  const theme = THEMES[settings.theme] || THEMES['cyber-teal'];
  const prevSecondsRef = useRef<string>('');

  // Clock Ticker Effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now);

      const secStr = String(now.getSeconds()).padStart(2, '0');
      if (prevSecondsRef.current !== secStr) {
        prevSecondsRef.current = secStr;
        if (settings.secondTickSound && settings.soundEnabled) {
          soundFX.playTick(true);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, [settings.secondTickSound, settings.soundEnabled]);

  // Screen Wake Lock sync
  useEffect(() => {
    if (settings.screenWakeLock) {
      requestLock().catch(() => {});
    } else {
      releaseLock().catch(() => {});
    }
  }, [settings.screenWakeLock, requestLock, releaseLock]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lockscreen_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lockscreen_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Listen to Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  }, []);

  // Task actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  // Time & Date format computations
  const timeInfo = formatTimeParts(currentDate, settings.is24Hour);
  const dateInfo = formatGregorianDateParts(currentDate);
  const hijriInfo = getHijriDate(currentDate, settings.hijriOffsetDays);

  return (
    <div
      className="min-h-screen w-full bg-cyber-matrix text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 transition-all duration-300 relative select-none"
      style={{
        filter: settings.dimMode
          ? `brightness(${Math.min(settings.brightness, 45)}%)`
          : `brightness(${settings.brightness}%)`,
      }}
    >
      {/* Top Floating Utility Quick-Bar */}
      <header className="w-full max-w-xl flex items-center justify-between py-1 mb-2 px-1">
        <div className="flex items-center gap-2">
          {/* Wake Lock Active Live Status */}
          <button
            onClick={() => {
              soundFX.playClick();
              updateSettings({ screenWakeLock: !settings.screenWakeLock });
            }}
            title={
              settings.screenWakeLock
                ? 'Screen Wake Lock is ACTIVE (Screen will stay permanently on)'
                : 'Turn on Screen Wake Lock'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono tracking-wider transition ${
              settings.screenWakeLock
                ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            {settings.screenWakeLock ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">
              {settings.screenWakeLock ? 'WAKE LOCK ON' : 'WAKE LOCK OFF'}
            </span>
          </button>

          {/* Dim Mode (AOD) Quick Button */}
          <button
            onClick={() => {
              soundFX.playClick();
              updateSettings({ dimMode: !settings.dimMode });
            }}
            title={settings.dimMode ? 'Turn off Dim Mode' : 'Night / AOD Dim Mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition ${
              settings.dimMode
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {settings.dimMode ? 'DIM (AOD)' : 'NORMAL'}
            </span>
          </button>
        </div>

        {/* Right side: Lockscreen Guide + PWA Install + Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playClick();
              setIsLockScreenModalOpen(true);
            }}
            title="Set on Mobile Lock Screen (Power button dabane par dekhne ka tareeqa)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-md"
            style={{
              borderColor: `${theme.primaryColor}90`,
              backgroundColor: `${theme.primaryColor}22`,
              color: theme.primaryColor,
              boxShadow: `0 0 12px ${theme.primaryColor}30`,
            }}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Set on Lock Screen</span>
          </button>

          <PWAInstallButton theme={theme} />

          <button
            onClick={() => {
              soundFX.playClick();
              setIsSettingsOpen(true);
            }}
            title="Open Settings"
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-700/80 bg-slate-900/90 text-slate-300 hover:text-white transition text-xs font-mono"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </header>

      {/* Main Lock Screen Card Container matching User Screenshot */}
      <main className="w-full max-w-xl flex flex-col gap-4">
        {/* Top Header Card */}
        <ClockHeader
          theme={theme}
          portalTitle={settings.portalTitle}
          onUpdatePortalTitle={(newTitle) => updateSettings({ portalTitle: newTitle })}
          hijriDate={hijriInfo}
          currentDate={currentDate}
          is24Hour={settings.is24Hour}
          onToggleTimeFormat={() => updateSettings({ is24Hour: !settings.is24Hour })}
          wakeLockActive={isWakeLockActive || settings.screenWakeLock}
          onToggleWakeLock={() => updateSettings({ screenWakeLock: !settings.screenWakeLock })}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          onOpenSettings={() => setIsSettingsOpen(true)}
          dimMode={settings.dimMode}
          onToggleDimMode={() => updateSettings({ dimMode: !settings.dimMode })}
        />

        {/* Digital Clock with Shining Effect */}
        <DigitalClockCard
          theme={theme}
          hours={timeInfo.hours}
          minutes={timeInfo.minutes}
          seconds={timeInfo.seconds}
          ampm={timeInfo.ampm}
          is24Hour={settings.is24Hour}
        />

        {/* Shining Digital Calendar Card */}
        <CalendarCard
          theme={theme}
          day={dateInfo.day}
          month={dateInfo.month}
          year={dateInfo.year}
        />

        {/* Daily Tasks Widget */}
        <DailyTasksWidget
          theme={theme}
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onClearCompleted={handleClearCompleted}
        />
      </main>

      {/* Standby / Immersive Prompt Helper */}
      <footer className="w-full max-w-xl mt-6 pb-6 text-center text-slate-500 text-xs font-mono select-none">
        <p className="flex items-center justify-center gap-1.5 opacity-80">
          <Sparkles className="w-3 h-3 text-[#10f0b4]" />
          <span>Live Lock Screen StandBy Mode Active</span>
          <span>•</span>
          <span>Ticking & Saving State in Real-Time</span>
        </p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        theme={theme}
        onUpdateSettings={updateSettings}
        isWakeLockSupported={isWakeLockSupported}
      />

      {/* Lock Screen Setup / HD Wallpaper Export Modal */}
      <LockScreenSetupModal
        isOpen={isLockScreenModalOpen}
        onClose={() => setIsLockScreenModalOpen(false)}
        theme={theme}
        portalTitle={settings.portalTitle}
        hijriDate={hijriInfo}
        currentDate={currentDate}
        tasks={tasks}
        settings={settings}
        timeStr={timeInfo.fullTimeStr}
        secondsStr={timeInfo.seconds}
        dateStr={dateInfo.formatted}
        onActivateWakeLock={() => updateSettings({ screenWakeLock: true })}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
