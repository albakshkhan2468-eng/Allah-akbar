// Date, time, Hijri calendar and Urdu days utility

export const URDU_DAYS: Record<number, { urdu: string; transliteration: string; english: string }> = {
  0: { urdu: 'اتوار', transliteration: 'Itwar', english: 'SUNDAY' },
  1: { urdu: 'پیر', transliteration: 'Peer', english: 'MONDAY' },
  2: { urdu: 'منگل', transliteration: 'Mangal', english: 'TUESDAY' },
  3: { urdu: 'بدھ', transliteration: 'Budh', english: 'WEDNESDAY' },
  4: { urdu: 'جمعرات', transliteration: 'Jumerat', english: 'THURSDAY' },
  5: { urdu: 'جمعہ', transliteration: 'Jumah', english: 'FRIDAY' },
  6: { urdu: 'ہفتہ', transliteration: 'Hafta', english: 'SATURDAY' },
};

const ISLAMIC_MONTHS_URDU = [
  'محرم',
  'صفر',
  'ربیع الاول',
  'ربیع الثانی',
  'جمادی الاول',
  'جمادی الثانی',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذوالقعدہ',
  'ذوالحجہ',
];

export interface HijriDateInfo {
  day: number;
  monthIndex: number;
  monthNameUrdu: string;
  monthNameEn: string;
  year: number;
  formattedUrdu: string; // e.g. "جمادی الاول 1448 هجری 10"
}

export function getHijriDate(date: Date = new Date(), offsetDays: number = 0): HijriDateInfo {
  // Apply manual lunar offset in days
  const targetDate = new Date(date.getTime() + offsetDays * 24 * 60 * 60 * 1000);

  try {
    // Attempt using native Intl API
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(targetDate);
    const dayPart = parts.find((p) => p.type === 'day')?.value;
    const monthPart = parts.find((p) => p.type === 'month')?.value;
    const yearPart = parts.find((p) => p.type === 'year')?.value;

    if (dayPart && monthPart && yearPart) {
      const day = parseInt(dayPart, 10);
      const month = Math.max(1, Math.min(12, parseInt(monthPart, 10)));
      const year = parseInt(yearPart, 10);
      const monthNameUrdu = ISLAMIC_MONTHS_URDU[month - 1] || 'جمادی الاول';
      return {
        day,
        monthIndex: month - 1,
        monthNameUrdu,
        monthNameEn: `Month ${month}`,
        year,
        formattedUrdu: `${monthNameUrdu} ${year} هجری ${day}`,
      };
    }
  } catch {
    // fallback if Intl islamic calendar is unsupported on older platforms
  }

  // Algorithmic Kuwaiti / astronomical approximation fallback
  const d = targetDate.getDate();
  const m = targetDate.getMonth();
  const y = targetDate.getFullYear();

  let jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 13) / 12))) / 4) +
    Math.floor((367 * (m - 1 - 12 * Math.floor((m - 13) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 13) / 12)) / 100)) / 4) +
    d -
    32075;

  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hijriMonth = Math.floor((24 * l) / 709);
  const hijriDay = l - Math.floor((709 * hijriMonth) / 24);
  const hijriYear = 30 * n + j - 30;

  const mIndex = Math.max(0, Math.min(11, hijriMonth - 1));
  const monthNameUrdu = ISLAMIC_MONTHS_URDU[mIndex] || 'جمادی الاول';

  return {
    day: hijriDay,
    monthIndex: mIndex,
    monthNameUrdu,
    monthNameEn: `Month ${hijriMonth}`,
    year: hijriYear,
    formattedUrdu: `${monthNameUrdu} ${hijriYear} هجری ${hijriDay}`,
  };
}

export function formatGregorianDateParts(date: Date = new Date()) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  return {
    day,
    month,
    year,
    formatted: `${day} . ${month} . ${year}`,
  };
}

export function formatTimeParts(date: Date = new Date(), is24h: boolean = true) {
  let hours = date.getHours();
  const rawHours = hours;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';

  if (!is24h) {
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 becomes 12
  }

  const hoursStr = String(hours).padStart(2, '0');

  return {
    hours: hoursStr,
    minutes,
    seconds,
    ampm,
    is24h,
    fullTimeStr: `${hoursStr}:${minutes}`,
  };
}
