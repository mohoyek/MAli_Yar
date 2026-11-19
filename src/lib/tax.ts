// Tax constants & helpers shared by the calculators (amounts in ریال).

export type Bracket = { upTo: number; rate: number };

export type SalaryYear = {
  monthly: Bracket[];
  annual: Bracket[];
  exemptionMonthly: number;
  exemptionAnnual: number;
  note: string;
};

const INF = Number.POSITIVE_INFINITY;

export const SALARY_BRACKETS: Record<string, SalaryYear> = {
  "1405": {
    exemptionMonthly: 400_000_000,
    exemptionAnnual: 4_800_000_000,
    monthly: [
      { upTo: 400_000_000, rate: 0 },
      { upTo: 800_000_000, rate: 0.1 },
      { upTo: 1_000_000_000, rate: 0.15 },
      { upTo: 1_200_000_000, rate: 0.2 },
      { upTo: 1_400_000_000, rate: 0.25 },
      { upTo: INF, rate: 0.3 },
    ],
    annual: [
      { upTo: 4_800_000_000, rate: 0 },
      { upTo: 9_600_000_000, rate: 0.1 },
      { upTo: 12_000_000_000, rate: 0.15 },
      { upTo: 14_400_000_000, rate: 0.2 },
      { upTo: 16_800_000_000, rate: 0.25 },
      { upTo: INF, rate: 0.3 },
    ],
    note: "عملکرد ۱۴۰۵: سقف معافیت ماهانه ۴۰ میلیون تومان (۴۰۰ میلیون ریال) و سالانه ۴۸۰ میلیون تومان است؛ پله‌های بالاتر تا ۳۰ درصد ادامه دارند.",
  },
  "1404": {
    exemptionMonthly: 240_000_000,
    exemptionAnnual: 2_880_000_000,
    monthly: [
      { upTo: 240_000_000, rate: 0 },
      { upTo: 300_000_000, rate: 0.1 },
      { upTo: 380_000_000, rate: 0.15 },
      { upTo: 500_000_000, rate: 0.2 },
      { upTo: 667_000_000, rate: 0.25 },
      { upTo: INF, rate: 0.3 },
    ],
    annual: [
      { upTo: 2_880_000_000, rate: 0 },
      { upTo: 3_600_000_000, rate: 0.1 },
      { upTo: 4_560_000_000, rate: 0.15 },
      { upTo: 6_000_000_000, rate: 0.2 },
      { upTo: 8_004_000_000, rate: 0.25 },
      { upTo: INF, rate: 0.3 },
    ],
    note: "عملکرد ۱۴۰۴: سقف معافیت ماهانه ۲۴ میلیون تومان (۲۴۰ میلیون ریال) طبق تبصره ۱۲ بودجه ۱۴۰۴.",
  },
};

// Social Security parameters, 1405
export const SSO_1405 = {
  minDaily: 5_541_850,
  capMultiple: 7,
  employeeRate: 0.07,
  employerRate: 0.23,
  totalRate: 0.3,
};

export function capDaily(year = "1405"): number {
  if (year === "1405") return SSO_1405.minDaily * SSO_1405.capMultiple; // 38,792,950
  if (year === "1404") return 1_944_000 * 7; // حداقل دستمزد روزانه ۱۴۰۴ تقریبی
  return SSO_1405.minDaily * SSO_1405.capMultiple;
}

export type BracketSlice = { amount: number; tax: number; rate: number };

export function progressiveTax(
  income: number,
  brackets: Bracket[]
): { perBracket: BracketSlice[]; total: number } {
  const perBracket: BracketSlice[] = [];
  let prev = 0;
  let total = 0;
  for (const b of brackets) {
    const hi = b.upTo;
    const amount = Math.max(0, Math.min(income, hi) - prev);
    const tax = amount * b.rate;
    if (amount > 0 || b.rate === 0) {
      perBracket.push({ amount, tax, rate: b.rate });
    }
    total += tax;
    prev = hi;
    if (income <= hi) break;
  }
  return { perBracket, total };
}
