import { Task } from '../types';
import { ThemeConfig } from './theme';
import { HijriDateInfo, URDU_DAYS } from './dateUtils';

interface GenerateWallpaperOptions {
  theme: ThemeConfig;
  portalTitle: string;
  hijriDate: HijriDateInfo;
  currentDate: Date;
  tasks: Task[];
  is24Hour: boolean;
  timeStr: string;
  secondsStr: string;
  dateStr: string;
}

export function generateLockscreenWallpaper(options: GenerateWallpaperOptions): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    // High-definition modern smartphone screen resolution (1080 x 2400)
    const width = 1080;
    const height = 2400;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    const { theme, portalTitle, hijriDate, currentDate, tasks, timeStr, secondsStr, dateStr } = options;
    const dayInfo = URDU_DAYS[currentDate.getDay()] || URDU_DAYS[3];

    // 1. Background Fill
    ctx.fillStyle = '#030a0d';
    ctx.fillRect(0, 0, width, height);

    // 2. Cyber Matrix Dot Grid Pattern
    ctx.fillStyle = 'rgba(16, 240, 180, 0.12)';
    const dotSpacing = 36;
    for (let x = 18; x < width; x += dotSpacing) {
      for (let y = 18; y < height; y += dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Ambient Radial Glow behind clock
    const radialGlow = ctx.createRadialGradient(width / 2, 800, 50, width / 2, 800, 600);
    radialGlow.addColorStop(0, 'rgba(16, 240, 180, 0.15)');
    radialGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, width, height);

    // Helper for rounded rect
    const drawRoundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number,
      fill: string,
      stroke: string,
      lineWidth: number = 3,
      glowColor?: string
    ) => {
      ctx.save();
      if (glowColor) {
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 24;
      }
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.restore();
    };

    // Safe Area from Top (Notification & Camera punch-hole area ~220px)
    let currentY = 240;
    const cardWidth = 960;
    const cardX = (width - cardWidth) / 2;

    // --- CARD 1: OFFICIAL HEADER CARD ---
    const headerHeight = 340;
    drawRoundRect(
      cardX,
      currentY,
      cardWidth,
      headerHeight,
      36,
      '#051317',
      'rgba(16, 240, 180, 0.45)',
      4,
      'rgba(16, 240, 180, 0.3)'
    );

    // Clock icon square
    drawRoundRect(cardX + 40, currentY + 45, 90, 90, 24, 'rgba(16, 240, 180, 0.15)', theme.primaryColor, 3);
    // Draw clock icon inside
    ctx.save();
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cardX + 85, currentY + 90, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cardX + 85, currentY + 90);
    ctx.lineTo(cardX + 85, currentY + 74);
    ctx.moveTo(cardX + 85, currentY + 90);
    ctx.lineTo(cardX + 97, currentY + 90);
    ctx.stroke();
    ctx.restore();

    // Text: OFFICIAL DIGITAL CLOCK & CALENDAR
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 26px monospace';
    ctx.fillText('OFFICIAL DIGITAL CLOCK & CALENDAR', cardX + 155, currentY + 75);

    // Portal Title: Albaksh Molsab Tuition Portal
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 36px system-ui, sans-serif';
    ctx.fillText(portalTitle, cardX + 155, currentY + 120);

    // Hijri Date: جمادی الاول 1448 هجری 10
    ctx.save();
    ctx.fillStyle = theme.amberColor;
    ctx.font = 'bold 34px system-ui, sans-serif';
    ctx.shadowColor = theme.amberColor;
    ctx.shadowBlur = 12;
    ctx.fillText(hijriDate.formattedUrdu, cardX + 155, currentY + 165);
    ctx.restore();

    // Divider line inside header
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, currentY + 210);
    ctx.lineTo(cardX + cardWidth - 40, currentY + 210);
    ctx.stroke();

    // Day Pill: WEDNESDAY • بدھ (Budh)
    drawRoundRect(
      cardX + 40,
      currentY + 235,
      460,
      70,
      35,
      'rgba(16, 240, 180, 0.12)',
      theme.primaryColor,
      3,
      'rgba(16, 240, 180, 0.25)'
    );
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.fillText(`${dayInfo.english} • ${dayInfo.urdu} (${dayInfo.transliteration})`, cardX + 70, currentY + 280);

    // 24H format pill
    drawRoundRect(cardX + cardWidth - 160, currentY + 235, 120, 70, 35, '#0a161b', '#475569', 3);
    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(options.is24Hour ? '24H' : '12H', cardX + cardWidth - 132, currentY + 280);

    currentY += headerHeight + 50;

    // --- CARD 2: DIGITAL CLOCK DISPLAY ---
    const clockCardHeight = 270;
    const clockBoxWidth = 660;
    const secBoxWidth = cardWidth - clockBoxWidth - 30;

    // Clock Box (Hours:Minutes)
    drawRoundRect(
      cardX,
      currentY,
      clockBoxWidth,
      clockCardHeight,
      36,
      '#040e11',
      theme.primaryColor,
      4,
      'rgba(16, 240, 180, 0.4)'
    );

    // Huge glowing digital time
    ctx.save();
    ctx.fillStyle = theme.primaryColor;
    ctx.font = '900 135px monospace, sans-serif';
    ctx.shadowColor = theme.primaryColor;
    ctx.shadowBlur = 32;
    ctx.textAlign = 'center';

    const parts = timeStr.split(':');
    const hh = parts[0] || '22';
    const mm = parts[1] || '15';

    ctx.fillText(hh, cardX + clockBoxWidth / 2 - 130, currentY + 185);

    // Colon
    ctx.fillStyle = theme.amberColor;
    ctx.shadowColor = theme.amberColor;
    ctx.shadowBlur = 28;
    ctx.fillText(':', cardX + clockBoxWidth / 2, currentY + 175);

    // Minutes
    ctx.fillStyle = theme.primaryColor;
    ctx.shadowColor = theme.primaryColor;
    ctx.shadowBlur = 32;
    ctx.fillText(mm, cardX + clockBoxWidth / 2 + 130, currentY + 185);
    ctx.restore();

    // Seconds Box (SEC 32)
    const secBoxX = cardX + clockBoxWidth + 30;
    drawRoundRect(
      secBoxX,
      currentY,
      secBoxWidth,
      clockCardHeight,
      36,
      '#040e11',
      theme.amberColor,
      4,
      'rgba(245, 158, 11, 0.35)'
    );

    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 26px monospace';
    ctx.fillText('SEC', secBoxX + secBoxWidth / 2, currentY + 95);

    ctx.fillStyle = theme.amberColor;
    ctx.font = '900 95px monospace, sans-serif';
    ctx.shadowColor = theme.amberColor;
    ctx.shadowBlur = 24;
    ctx.fillText(secondsStr, secBoxX + secBoxWidth / 2, currentY + 200);
    ctx.restore();

    currentY += clockCardHeight + 50;

    // --- CARD 3: SHINING DIGITAL CALENDAR ---
    const calHeight = 240;
    drawRoundRect(
      cardX,
      currentY,
      cardWidth,
      calHeight,
      36,
      '#051317',
      'rgba(16, 240, 180, 0.45)',
      4,
      'rgba(16, 240, 180, 0.25)'
    );

    // Header: ✨ SHINING DIGITAL CALENDAR + LIVE
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('✨ SHINING DIGITAL CALENDAR', cardX + 40, currentY + 48);

    // LIVE Badge
    drawRoundRect(cardX + cardWidth - 140, currentY + 22, 100, 42, 21, 'rgba(16, 240, 180, 0.15)', theme.primaryColor, 2);
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 18px monospace';
    ctx.fillText('LIVE', cardX + cardWidth - 105, currentY + 49);

    // Inner glowing date box
    const innerDateY = currentY + 75;
    const innerDateH = 135;
    drawRoundRect(
      cardX + 30,
      innerDateY,
      cardWidth - 60,
      innerDateH,
      24,
      '#040e11',
      theme.amberColor,
      3,
      'rgba(245, 158, 11, 0.25)'
    );

    // Format: DATE : DD . MM . YYYY
    ctx.textAlign = 'center';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('DATE : DD . MM . YYYY', width / 2, innerDateY + 38);

    // Digits: 21 . 10 . 2026
    ctx.save();
    ctx.fillStyle = theme.amberColor;
    ctx.font = '900 68px monospace, sans-serif';
    ctx.shadowColor = theme.amberColor;
    ctx.shadowBlur = 24;
    ctx.fillText(dateStr, width / 2, innerDateY + 110);
    ctx.restore();

    currentY += calHeight + 50;

    // --- CARD 4: DAILY TASKS WIDGET ---
    const tasksHeight = 820;
    drawRoundRect(
      cardX,
      currentY,
      cardWidth,
      tasksHeight,
      36,
      '#051317',
      'rgba(16, 240, 180, 0.45)',
      4,
      'rgba(16, 240, 180, 0.25)'
    );

    // Tasks header
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 28px monospace';
    ctx.fillText('DAILY TASKS & SCHEDULE (روزانہ کے کام)', cardX + 40, currentY + 58);

    const completed = tasks.filter((t) => t.completed).length;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px monospace';
    ctx.fillText(`${completed} of ${tasks.length} Completed`, cardX + 40, currentY + 95);

    // Progress bar
    drawRoundRect(cardX + 40, currentY + 115, cardWidth - 80, 14, 7, '#0f172a', '#334155', 1);
    const progressW = tasks.length > 0 ? ((cardWidth - 80) * completed) / tasks.length : 0;
    if (progressW > 0) {
      drawRoundRect(cardX + 40, currentY + 115, progressW, 14, 7, theme.primaryColor, theme.primaryColor, 1);
    }

    // Render up to 5 top tasks
    let taskY = currentY + 160;
    const taskDisplayList = tasks.slice(0, 5);

    taskDisplayList.forEach((task) => {
      drawRoundRect(
        cardX + 40,
        taskY,
        cardWidth - 80,
        105,
        20,
        task.completed ? 'rgba(0,0,0,0.4)' : '#040e11',
        task.completed ? '#334155' : 'rgba(16, 240, 180, 0.3)',
        2
      );

      // Checkbox
      ctx.save();
      if (task.completed) {
        ctx.fillStyle = theme.primaryColor;
        ctx.beginPath();
        ctx.roundRect(cardX + 65, taskY + 32, 40, 40, 8);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('✓', cardX + 75, taskY + 62);
      } else {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 3;
        ctx.strokeRect(cardX + 65, taskY + 32, 40, 40);
      }
      ctx.restore();

      // Task Title
      ctx.fillStyle = task.completed ? '#64748b' : '#f8fafc';
      ctx.font = 'bold 26px system-ui, sans-serif';
      const maxTitleLen = 38;
      const displayTitle = task.title.length > maxTitleLen ? task.title.slice(0, maxTitleLen) + '...' : task.title;
      ctx.fillText(displayTitle, cardX + 125, taskY + 58);

      // Task Time & Category
      ctx.fillStyle = theme.amberColor;
      ctx.font = '20px monospace';
      const timeTag = task.time ? `⏰ ${task.time}` : '⏰ Daily';
      ctx.fillText(`${timeTag} • [${task.category.toUpperCase()}]`, cardX + 125, taskY + 88);

      taskY += 125;
    });

    // Bottom Lock Screen Swipe Indicator
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.fillText('Swipe up to unlock', width / 2, height - 80);
    // Home bar pill
    drawRoundRect(width / 2 - 120, height - 50, 240, 10, 5, 'rgba(255, 255, 255, 0.6)', 'transparent', 0);

    resolve(canvas.toDataURL('image/png'));
  });
}
