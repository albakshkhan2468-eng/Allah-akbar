import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Clock,
  Tag,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  CalendarDays,
  X,
  Check,
} from 'lucide-react';
import { Task } from '../types';
import { ThemeConfig } from '../utils/theme';
import { soundFX } from '../utils/audio';

interface DailyTasksWidgetProps {
  theme: ThemeConfig;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<Task, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onClearCompleted: () => void;
}

export const DailyTasksWidget: React.FC<DailyTasksWidgetProps> = ({
  theme,
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onClearCompleted,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState<Task['category']>('tuition');
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleToggle = (taskId: string, isCurrentlyCompleted: boolean) => {
    if (!isCurrentlyCompleted) {
      soundFX.playTaskComplete();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.75 },
          colors: [theme.primaryColor, theme.amberColor, '#ffffff'],
        });
      } catch {
        // Confetti safe catch
      }
    } else {
      soundFX.playClick();
    }
    onToggleTask(taskId);
  };

  const handleSubmitNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    soundFX.playClick();
    onAddTask({
      title: newTitle.trim(),
      time: newTime || undefined,
      category: newCategory,
      priority: newPriority,
      completed: false,
    });

    setNewTitle('');
    setNewTime('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (category: Task['category']) => {
    switch (category) {
      case 'tuition':
        return <BookOpen className="w-3 h-3 text-[#10f0b4]" />;
      case 'study':
        return <GraduationCap className="w-3 h-3 text-sky-400" />;
      case 'prayer':
        return <Sparkles className="w-3 h-3 text-amber-400" />;
      case 'important':
        return <AlertCircle className="w-3 h-3 text-rose-400" />;
      default:
        return <Tag className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border ${theme.borderColor} ${theme.cardBg} transition-all duration-300 relative`}
      style={{
        boxShadow: theme.glowShadow,
      }}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{
              borderColor: `${theme.primaryColor}80`,
              backgroundColor: `${theme.primaryColor}15`,
              color: theme.primaryColor,
            }}
          >
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className="text-xs sm:text-sm font-hud font-bold tracking-wider uppercase"
                style={{ color: theme.primaryColor }}
              >
                DAILY TASKS & SCHEDULE
              </h3>
              <span className="font-arabic text-xs font-bold text-slate-400">
                (روزانہ کے کام)
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              {completedCount} of {totalCount} completed ({progressPercent}%)
            </p>
          </div>
        </div>

        {/* Action: + New Task */}
        <button
          onClick={() => {
            soundFX.playClick();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider transition-all duration-200 active:scale-95 shadow-sm"
          style={{
            borderColor: `${theme.primaryColor}80`,
            backgroundColor: `${theme.primaryColor}20`,
            color: theme.primaryColor,
            boxShadow: `0 0 10px ${theme.primaryColor}25`,
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD TASK</span>
        </button>
      </div>

      {/* Glowing Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden mb-4 relative">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.amberColor})`,
            boxShadow: `0 0 10px ${theme.primaryColor}`,
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          {(['all', 'pending', 'completed'] as const).map((tab) => {
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  soundFX.playClick();
                  setFilter(tab);
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all ${
                  isActive
                    ? 'font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${theme.primaryColor}25`,
                        color: theme.primaryColor,
                        border: `1px solid ${theme.primaryColor}60`,
                      }
                    : {}
                }
              >
                {tab}
              </button>
            );
          })}
        </div>

        {completedCount > 0 && (
          <button
            onClick={() => {
              soundFX.playClick();
              onClearCompleted();
            }}
            className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-slate-500 font-mono text-xs">
            {filter === 'completed'
              ? 'No completed tasks yet. Finish a task above!'
              : 'No pending tasks! Add your routine tuition or study tasks.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-black/30 border-slate-800/60 opacity-60'
                    : `bg-black/50 ${theme.borderColor} hover:bg-black/70`
                }`}
              >
                {/* Left: Checkbox + Content */}
                <div
                  className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                  onClick={() => handleToggle(task.id, task.completed)}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 transition-transform active:scale-90"
                    title={task.completed ? 'Mark pending' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckSquare
                        className="w-5 h-5 transition-colors"
                        style={{ color: theme.primaryColor }}
                      />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 hover:text-slate-300 transition-colors" />
                    )}
                  </button>

                  <div className="flex flex-col gap-1 min-w-0">
                    <span
                      className={`text-xs sm:text-sm font-medium tracking-wide break-words transition-all ${
                        task.completed
                          ? 'line-through text-slate-500'
                          : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Metadata: Time + Category + Priority */}
                    <div className="flex items-center gap-2 flex-wrap text-[10px] font-mono text-slate-400">
                      {task.time && (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-2.5 h-2.5 text-amber-400" />
                          <span>{task.time}</span>
                        </span>
                      )}

                      <span className="flex items-center gap-1 uppercase opacity-80">
                        {getCategoryIcon(task.category)}
                        <span>{task.category}</span>
                      </span>

                      {task.priority === 'high' && (
                        <span className="text-rose-400 font-bold uppercase tracking-wider">
                          [URGENT]
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFX.playClick();
                    onDeleteTask(task.id);
                  }}
                  title="Delete Task"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition opacity-80 sm:opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-2xl p-5 border ${theme.borderColor} bg-[#06151a] shadow-2xl relative`}
            style={{ boxShadow: `0 0 35px ${theme.primaryColor}30` }}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <h4
                className="text-sm font-hud font-bold tracking-wider uppercase flex items-center gap-2"
                style={{ color: theme.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                Add New Lock Screen Task
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewTask} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Task Title / کام کا نام
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuition Batch 1 Physics Class"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10f0b4]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10f0b4]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Task['category'])}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10f0b4]"
                  >
                    <option value="tuition">Tuition / ٹیوشن</option>
                    <option value="study">Study / پڑھائی</option>
                    <option value="prayer">Prayer / نماز</option>
                    <option value="important">Important / ضروری</option>
                    <option value="personal">Personal / ذاتی</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={`py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition ${
                        newPriority === p
                          ? p === 'high'
                            ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                            : 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-black transition active:scale-95 shadow-md"
                  style={{
                    backgroundColor: theme.primaryColor,
                    boxShadow: `0 0 12px ${theme.primaryColor}88`,
                  }}
                >
                  <Check className="w-4 h-4" />
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
