// Jalali (Solar Hijri / Persian) calendar conversion.
// Based on the Reingold–Dershowitz algorithm (Calendrical Calculations).
// All Jalali dates use { year, month, day } with 1-based month (1..12) and day (1..31).

import { toLatinDigits, fa2 } from "./format";

function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/** Julian Day Number (half-integer at noon) for a Jalali date. */
export function persianToJd(year: number, month: number, day: number): number {
  const epbase = year - 474;
  const epyear = 474 + mod(epbase, 2820);
  return (
    day +
    (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6) +
    Math.floor((epyear * 682 - 110) / 2816) +
    (epyear - 1) * 365 +
    Math.floor(epbase / 2820) * 1029983 +
    1948320.5 -
    1
  );
}

/** Convert a Julian Day (float) to a Jalali date. */
export function jdToPersian(jd: number): { year: number; month: number; day: number } {
  const jd0 = Math.floor(jd - 0.5) + 0.5;
  const depoch = jd0 - persianToJd(475, 1, 1);
  const cycle = Math.floor(depoch / 1029983);
  const cyear = mod(depoch, 1029983);
  let ycycle: number;
  if (cyear === 1029982) {
    ycycle = 2820;
  } else {
    const aux1 = Math.floor(cyear / 366);
    const aux2 = mod(cyear, 366);
    ycycle = Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
  }
  let year = ycycle + 2820 * cycle + 474;
  if (year <= 0) year -= 1;
  const yday = jd0 - persianToJd(year, 1, 1) + 1;
  const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
  const day = Math.floor(jd0 - persianToJd(year, month, 1) + 1);
  return { year, month, day };
}

export function isLeap(jy: number): boolean {
  return persianToJd(jy + 1, 1, 1) - persianToJd(jy, 1, 1) === 366;
}

export function daysInMonth(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isLeap(jy) ? 30 : 29;
}

/** Integer day number for a Jalali date (consecutive across dates). */
export function jalaliToDayNumber(jy: number, jm: number, jd: number): number {
  return Math.floor(persianToJd(jy, jm, jd));
}

/** Inverse of jalaliToDayNumber. */
export function dayNumberToJalali(dn: number): { year: number; month: number; day: number } {
  return jdToPersian(dn + 0.5);
}

export function gregorianToJdn(gy: number, gm: number, gd: number): number {
  const d = new Date(Date.UTC(gy, gm - 1, gd, 12, 0, 0));
  return Math.floor(d.getTime() / 86400000 + 2440587.5 + 0.5);
}

/** Today's Jalali date in Asia/Tehran timezone. */
export function todayJalali(): { year: number; month: number; day: number } {
  const fmt = new Intl.DateTimeFormat("en-US-u-ca-gregory", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return dayNumberToJalali(gregorianToJdn(get("year"), get("month"), get("day")));
}

export function parseJalali(input: string): { year: number; month: number; day: number } | null {
  if (!input) return null;
  const s = toLatinDigits(String(input)).trim();
  const m = s.match(/^(\d{2,4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (!m) return null;
  const year = +m[1];
  const month = +m[2];
  const day = +m[3];
  if (year < 1300 || year > 1500) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function formatJalali(d: { year: number; month: number; day: number }): string {
  const fy = new Intl.NumberFormat("fa-IR", { useGrouping: false }).format(d.year);
  return `${fy}/${fa2(d.month)}/${fa2(d.day)}`;
}
