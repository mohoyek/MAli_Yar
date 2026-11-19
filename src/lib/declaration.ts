// ---------------------------------------------------------------------------
//  منابع محاسباتی برای فرم‌های شبیه‌سازی‌شده اظهارنامه عملکرد و ارزش افزوده
//  (مبلغ بر حسب ریال — منبع: قانون مالیات‌های مستقیم و قانون مالیات بر
//  ارزش افزوده، به‌روز برای عملکرد ۱۴۰۲ تا ۱۴۰۵)
// ---------------------------------------------------------------------------

export type TaxYear = "1405" | "1404" | "1403" | "1402";

// ----- پله‌های مالیاتی ماده ۱۳۱ (اشخاص حقوقی و درآمد مشاغل) ---------------
//  نرخ‌ها بر اساس ماده ۱۳۱ قانون مالیات‌های مستقیم و تبصره‌های بودجه‌ای است.
//  پله اول تا سقف معافیت (ماده ۱۰۱) صفر، سپس ۱۵٪، ۲۰٪ و ۳۰٪ مازاد.
export type IncomeBracket = { upTo: number; rate: number };

export const INCOME_BRACKETS: Record<TaxYear, IncomeBracket[]> = {
  // عملکرد ۱۴۰۵: معافیت ماده ۱۰۱ معادل ۲۸۰ میلیون تومان (۲٫۸ میلیارد ریال)
  "1405": [
    { upTo: 2_800_000_000, rate: 0 }, // پله معاف (ماده ۱۰۱)
    { upTo: 4_000_000_000, rate: 0.15 }, // ۱۵٪
    { upTo: 8_000_000_000, rate: 0.2 }, // ۲۰٪
    { upTo: Number.POSITIVE_INFINITY, rate: 0.3 }, // ۳۰٪ مازاد
  ],
  // عملکرد ۱۴۰۴: معافیت ماده ۱۰۱ معادل ۲۰۰ میلیون تومان (۲ میلیارد ریال)
  "1404": [
    { upTo: 2_000_000_000, rate: 0 },
    { upTo: 2_000_000_000, rate: 0.15 },
    { upTo: 4_000_000_000, rate: 0.2 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
  ],
  // عملکرد ۱۴۰۳: معافیت پایه ۱۰۰ میلیون تومان (۱ میلیارد ریال)
  // با ثبت کامل تراکنش‌ها در سامانه مودیان تا ۱۴۴ میلیون تومان (۱٬۴۴۰٬۰۰۰٬۰۰۰ ریال) افزایش می‌یابد.
  "1403": [
    { upTo: 1_000_000_000, rate: 0 },
    { upTo: 2_000_000_000, rate: 0.15 },
    { upTo: 4_000_000_000, rate: 0.2 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
  ],
  // عملکرد ۱۴۰۲: معافیت پایه ۴۷٫۵ میلیون تومان (۴۷۵ میلیون ریال)
  // با ثبت کامل تراکنش‌ها در سامانه مودیان تا ۵۶٫۵ میلیون تومان (۵۶۵ میلیون ریال) افزایش می‌یابد.
  "1402": [
    { upTo: 475_000_000, rate: 0 },
    { upTo: 2_000_000_000, rate: 0.15 },
    { upTo: 4_000_000_000, rate: 0.2 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
  ],
};

export const INCOME_EXEMPTION: Record<TaxYear, number> = {
  "1405": 2_800_000_000,
  "1404": 2_000_000_000,
  "1403": 1_000_000_000,
  "1402": 475_000_000,
};

export const INCOME_YEAR_NOTE: Record<TaxYear, string> = {
  "1405":
    "عملکرد ۱۴۰۵: معافیت ماده ۱۰۱ برابر ۲۸۰ میلیون تومان (۲٫۸ میلیارد ریال) و پله‌های مالیاتی طبق ماده ۱۳۱ به نرخ‌های ۱۵٪، ۲۰٪ و ۳۰٪ اعمال می‌شود.",
  "1404":
    "عملکرد ۱۴۰۴: معافیت ماده ۱۰۱ برابر ۲۰۰ میلیون تومان (۲ میلیارد ریال) و پله‌های مالیاتی طبق ماده ۱۳۱ به نرخ‌های ۱۵٪، ۲۰٪ و ۳۰٪ اعمال می‌شود.",
  "1403":
    "عملکرد ۱۴۰۳: معافیت پایه ماده ۱۰۱ برابر ۱۰۰ میلیون تومان (۱ میلیارد ریال) است؛ با ثبت کامل تراکنش‌ها در سامانه مودیان تا ۱۴۴ میلیون تومان افزایش می‌یابد. پله‌های ماده ۱۳۱ به نرخ‌های ۱۵٪، ۲۰٪ و ۳۰٪ اعمال می‌شود.",
  "1402":
    "عملکرد ۱۴۰۲: معافیت پایه ماده ۱۰۱ برابر ۴۷٫۵ میلیون تومان (۴۷۵ میلیون ریال) است؛ با ثبت کامل تراکنش‌ها در سامانه مودیان تا ۵۶٫۵ میلیون تومان افزایش می‌یابد. پله‌های ماده ۱۳۱ به نرخ‌های ۱۵٪، ۲۰٪ و ۳۰٪ اعمال می‌شود.",
};

// ----- مالیات بر ارزش افزوده -------------------------------------------
// نرخ استاندارد ۹٪ طبق ماده ۱۲ قانون مالیات بر ارزش افزوده (۱۴۰۳ به بعد).
// صادرات نرخ صفر و برخی کالاها و خدمات معاف هستند.
export const VAT_RATE = 0.09;
export const VAT_RATE_ZERO_EXPORT = 0;

// مراحل دوره ارزش افزوده: فصلی (پیش‌فرض) یا ماهانه برای اشخاص خاص
export type VATPeriod = "seasonal" | "monthly";

export const VAT_SEASONS = [
  { id: "Q1", label: "فصل اول (فروردین– خرداد)" },
  { id: "Q2", label: "فصل دوم (تیر – شهریور)" },
  { id: "Q3", label: "فصل سوم (مهر – آذر)" },
  { id: "Q4", label: "فصل چهارم (دی – اسفند)" },
];

export const VAT_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

// ----- محاسبه مالیات پلکای درآمد -----------------------------------------
export type BracketSlice = { amount: number; tax: number; rate: number };

export function progressiveIncomeTax(
  taxableIncome: number,
  brackets: IncomeBracket[]
): { perBracket: BracketSlice[]; total: number } {
  const perBracket: BracketSlice[] = [];
  let prev = 0;
  let total = 0;
  for (const b of brackets) {
    const hi = b.upTo;
    const amount = Math.max(0, Math.min(taxableIncome, hi) - prev);
    const tax = amount * b.rate;
    if (amount > 0 || b.rate === 0) {
      perBracket.push({ amount, tax, rate: b.rate });
    }
    total += tax;
    prev = hi;
    if (taxableIncome <= hi) break;
  }
  return { perBracket, total };
}

// ----- ورودی‌های اظهارنامه عملکرد ----------------------------------------
export type IncomeFormInput = {
  // درآمد
  salesRevenue: number; // فروش کالا و خدمات (مشمول)
  exportRevenue: number; // صادرات (با نرخ صفر در عملکرد، اما اینجا درآمد است)
  otherIncome: number; // درآمد غیرعملیاتی (سود بانکی، تسعیromayette و ...)
  // هزینه‌های قابل قبول
  costOfGoodsSold: number; // بهای تمام‌شده کالای فروش‌رفته
  personnelCost: number; // دستمزد و هزینه پرسنل
  operatingExpense: number; // هزینه‌های اداری، عمومی و فروش
  depreciation: number; // استهلاک
  otherDeductible: number; // سایر هزینه‌های قابل قبول
  // مالیات‌های پرداختی/سپرده
  prepaidTax: number; // مالیات تسویه‌شده یا علی‌الحساب پرداختی در طول سال
  // انتخاب سال
  year: TaxYear;
};

export type IncomeFormResult = {
  grossIncome: number; // مجموع درآمد ناخالص
  totalDeductible: number; // مجموع هزینه‌های قابل قبول
  accountingProfit: number; // سود حسابداری پیش از کسر معافیت
  exemptionAmount: number; // معافیت ماده ۱۰۱
  taxableIncome: number; // درآمد مشمول پس از معافیت
  perBracket: BracketSlice[];
  taxDue: number; // مالیات متعلقه (محاسبه‌شده)
  prepaidTax: number;
  finalTax: number; // مبلغ قابل پرداخت (مثبت) یا قابل استرداد (منفی)
  effectiveRate: number; // نرخ مؤثر نسبت به درآمد ناخالص
};

export function computeIncomeTax(input: IncomeFormInput): IncomeFormResult {
  const grossIncome =
    input.salesRevenue + input.exportRevenue + input.otherIncome;
  const totalDeductible =
    input.costOfGoodsSold +
    input.personnelCost +
    input.operatingExpense +
    input.depreciation +
    input.otherDeductible;
  const accountingProfit = Math.max(0, grossIncome - totalDeductible);
  const exemptionAmount = INCOME_EXEMPTION[input.year];
  const taxableIncome = Math.max(0, accountingProfit - exemptionAmount);
  const { perBracket, total } = progressiveIncomeTax(
    taxableIncome,
    INCOME_BRACKETS[input.year]
  );
  const finalTax = total - input.prepaidTax;
  const effectiveRate =
    accountingProfit > 0 ? total / accountingProfit : 0;
  return {
    grossIncome,
    totalDeductible,
    accountingProfit,
    exemptionAmount,
    taxableIncome,
    perBracket,
    taxDue: total,
    prepaidTax: input.prepaidTax,
    finalTax,
    effectiveRate,
  };
}

// ----- ورودی‌های اظهارنامه ارزش افزوده -----------------------------------
export type VATFormInput = {
  // فروش و خدمات
  taxableSales: number; // فروش کالا و خدمات مشمول (با نرخ ۹٪)
  exemptSales: number; // فروش معاف (مثل خدمات بانکی، پزشکی، حمل‌ونقل عمومی و ...)
  exportSales: number; // صادرات (نرخ صفر)
  reverseChargeSales: number; // فروش معکوس (خرید از غیرمودی)
  // خریدها
  taxablePurchases: number; // خریدهای مشمول (با فاکتور رسمی)
  exemptPurchases: number; // خریدهای معاف
  reverseChargePurchases: number; // خرید معکوس (خرید از غیرمودی)
  // دوره
  year: TaxYear;
  period: VATPeriod;
  periodIndex: number; // شماره فصل (1..4) یا ماه (1..12)
  // مالیات دوره‌های قبل
  carriedForwardCredit: number; // اعتبار مالیاتی قابل انتقال از دوره قبل
};

export type VATFormResult = {
  totalSales: number; // کل فروش (مشمول + معاف + صادرات)
  outputVAT: number; // مالیات بر ارزش افزوده فروش (خروجی)
  reverseChargeOutputVAT: number; // مالیات فروش معکوس
  inputVAT: number; // مالیات بر ارزش افزوده خرید (ورودی)
  reverseChargeInputVAT: number; // مالیات خرید معکوس
  totalCredit: number; // مجموع اعتبار مالیاتی (ورودی + انتقالی)
  netVAT: number; // مالیات خالص (خروجی - اعتبار)
  // اگر مثبت => قابل پرداخت، اگر منفی => قابل استرداد/انتقال
  payableVAT: number;
  refundableVAT: number;
};

export function computeVAT(input: VATFormInput): VATFormResult {
  const totalSales =
    input.taxableSales + input.exemptSales + input.exportSales + input.reverseChargeSales;

  // مالیات خروجی (فروش): فقط بخش مشمول با نرخ ۹٪، فروش معکوس هم ۹٪
  const outputVAT = input.taxableSales * VAT_RATE;
  const reverseChargeOutputVAT = input.reverseChargeSales * VAT_RATE;

  // مالیات ورودی (خرید): فقط خریدهای مشمول با فاکتور رسمی ۹٪
  const inputVAT = input.taxablePurchases * VAT_RATE;
  const reverseChargeInputVAT = input.reverseChargePurchases * VAT_RATE;

  const totalCredit =
    inputVAT + reverseChargeInputVAT + input.carriedForwardCredit;
  const totalOutput = outputVAT + reverseChargeOutputVAT;
  const netVAT = totalOutput - totalCredit;

  const payableVAT = Math.max(0, netVAT);
  const refundableVAT = Math.max(0, -netVAT);

  return {
    totalSales,
    outputVAT,
    reverseChargeOutputVAT,
    inputVAT,
    reverseChargeInputVAT,
    totalCredit,
    netVAT,
    payableVAT,
    refundableVAT,
  };
}
