// Helpers for Persian number formatting and money parsing (shared by calculators).

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toLatinDigits(s: string): string {
  return String(s ?? "")
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)));
}

export function faNum(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "۰";
  return new Intl.NumberFormat("fa-IR").format(Math.round(n));
}

export function faNumDec(n: number, max = 2): string {
  if (!isFinite(n) || isNaN(n)) return "۰";
  return new Intl.NumberFormat("fa-IR", {
    maximumFractionDigits: max,
    minimumFractionDigits: 0,
  }).format(n);
}

export function faNumInt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "۰";
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(Math.trunc(n));
}

export function fa2(n: number): string {
  return new Intl.NumberFormat("fa-IR", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(n);
}

/** Parse a money string (Persian/Arabic digits, separators, ریال/تومان text) to a number. */
export function parseMoney(s: string): number {
  if (!s) return 0;
  const latin = toLatinDigits(String(s));
  const cleaned = latin.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return isNaN(n) ? 0 : n;
}

export function faPercent(rate: number, max = 2): string {
  return faNumDec(rate * 100, max) + "٪";
}
