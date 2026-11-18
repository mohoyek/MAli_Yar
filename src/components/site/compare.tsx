"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  BadgeCheck,
  AlertCircle,
  Sparkles,
  FileSpreadsheet,
  FileText,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  HelpCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Tax constants per عملکرد year (ریال)                               */
/*  منابع: قانون بودجه سالانه، بخشنامه‌های سازمان امور مالیاتی           */
/* ------------------------------------------------------------------ */

type YearData = {
  exemption: number; // معافیت سالانه ماده ۱۰۱ (بدون سامانه مودیان)
  b1: number; // سقف پله ۱۵٪ ماده ۱۳۱
  b2: number; // سقف پله ۲۰٪ ماده ۱۳۱
  ceiling: number; // سقف فروش تبصره ۱۰۰
  note?: string;
};

const TAX_YEARS: Record<string, YearData> = {
  "1405": {
    exemption: 2_800_000_000,
    b1: 4_000_000_000,
    b2: 8_000_000_000,
    ceiling: 720_000_000_000,
    note: "عملکرد ۱۴۰۵: معافیت ماده ۱۰۱ برابر ۲۸۰ میلیون تومان و پله‌های ماده ۱۳۱ تا ۴ و ۸ میلیارد ریال طبق قانون بودجه ۱۴۰۵ است.",
  },
  "1404": {
    exemption: 2_000_000_000,
    b1: 2_000_000_000,
    b2: 4_000_000_000,
    ceiling: 720_000_000_000,
    note: "عملکرد ۱۴۰۴: معافیت ماده ۱۰۱ برابر ۲۰۰ میلیون تومان است؛ سقف فروش تبصره ۱۰۰ برابر ۷۲ میلیارد تومان (۱۵۰ برابر معافیت ماده ۸۴) اعلام شده است.",
  },
  "1403": {
    exemption: 1_000_000_000,
    b1: 2_000_000_000,
    b2: 4_000_000_000,
    ceiling: 216_000_000_000,
    note: "عملکرد ۱۴۰۳: معافیت پایه ۱۰۰ میلیون تومان است و در صورت ثبت کامل تراکنش‌ها در سامانه مودیان تا ۱۴۴ میلیون تومان (۱٬۴۴۰٬۰۰۰٬۰۰۰ ریال) افزایش می‌یابد.",
  },
  "1402": {
    exemption: 475_000_000,
    b1: 2_000_000_000,
    b2: 4_000_000_000,
    ceiling: 71_250_000_000,
  },
  "1401": {
    exemption: 396_000_000,
    b1: 2_000_000_000,
    b2: 4_000_000_000,
    ceiling: 59_400_000_000,
  },
  "1400": {
    exemption: 360_000_000,
    b1: 500_000_000,
    b2: 1_000_000_000,
    ceiling: 54_000_000_000,
  },
};

/* ضریب سود فعالیت (اینتاکد) - مقادیر تقریبی برای برآورد */
const JOBS: { name: string; coef: number }[] = [
  { name: "سوپرمارکت و فروش مواد غذایی", coef: 15 },
  { name: "نانوایی (بربری، سنگک، لواش)", coef: 15 },
  { name: "فروش میوه و سبزی", coef: 20 },
  { name: "قصابی و فروش گوشت", coef: 20 },
  { name: "فروش مرغ و تخم‌مرغ", coef: 15 },
  { name: "لبنیات‌فروشی", coef: 15 },
  { name: "فروش آبمیوه، بستنی و فالوده", coef: 18.4 },
  { name: "رستوران و فست‌فود", coef: 25 },
  { name: "کافه و چایخانه", coef: 25 },
  { name: "فروش پوشاک و منسوجات", coef: 25 },
  { name: "کفش و چرم‌فروشی", coef: 25 },
  { name: "طلا و جواهرفروشی", coef: 8 },
  { name: "فروش موبایل و لوازم جانبی", coef: 15 },
  { name: "فروش لوازم خانگی", coef: 15 },
  { name: "فروش قطعات و لوازم خودرو", coef: 20 },
  { name: "تعمیرگاه خودرو (مکانیکی)", coef: 30 },
  { name: "صافکاری و نقاشی خودرو", coef: 30 },
  { name: "آرایشگاه و زیبایی", coef: 30 },
  { name: "داروخانه", coef: 10 },
  { name: "عطاری", coef: 20 },
  { name: "آژانس خدمات مسافرتی", coef: 10 },
  { name: "دفتر فنی و مهندسی", coef: 30 },
  { name: "مطب پزشک و کلینیک درمانی", coef: 45 },
  { name: "دندانپزشکی", coef: 50 },
  { name: "آموزشگاه آزاد", coef: 25 },
  { name: "چاپ، تبلیغات و گرافیک", coef: 25 },
  { name: "خشکشویی و لباسشویی", coef: 30 },
  { name: "عکاسی و فیلم‌برداری", coef: 30 },
  { name: "فروش مصالح ساختمانی", coef: 15 },
  { name: "تأسیسات مکانیکی و برقی ساختمان", coef: 35 },
  { name: "حمل‌ونقل کالا و باربری", coef: 25 },
];

const PARTNER_OPTIONS = [
  { value: "single", label: "یک نفر", count: 1 },
  { value: "multi", label: "دو نفر (یا بیشتر)", count: 2 },
  { value: "couple", label: "زن و شوهر", count: 1 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const faNum = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

const toFaDigits = (s: string) =>
  s.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

function parseMoney(raw: string): number {
  const digits = raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function formatMoneyInput(raw: string): string {
  const n = parseMoney(raw);
  return n ? new Intl.NumberFormat("en-US").format(n) : "";
}

type BracketResult = { b15: number; b20: number; b25: number; total: number };

function progressiveTax(income: number, b1: number, b2: number): BracketResult {
  const safe = Math.max(0, income);
  const p15 = Math.min(safe, b1);
  const p20 = Math.max(0, Math.min(safe, b2) - b1);
  const p25 = Math.max(0, safe - b2);
  const total = p15 * 0.15 + p20 * 0.2 + p25 * 0.25;
  return { b15: p15 * 0.15, b20: p20 * 0.2, b25: p25 * 0.25, total };
}

type Result = {
  netProfit: number;
  coefIncome: number;
  exemptionTotal: number;
  exemptionCount: number;
  ehtar: { taxable: number; tax: BracketResult };
  tabsare: { taxable: number; tax: BracketResult };
  saving: number;
  better: "ehtar" | "tabsare" | "equal";
  underCeiling: boolean;
  coef: number;
  year: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const faqItems = [
  {
    q: "این ابزار دقیقاً چه کاری می‌کند؟",
    a: "با یک بار وارد کردن فروش، هزینه و عنوان شغل، مالیات عملکرد شما را هم با روش اظهارنامه (بر پایه سود واقعی) و هم با روش تبصره ۱۰۰ (بر پایه ضریب اینتاکد) به‌صورت پله‌به‌پله محاسبه می‌کند و کنار هم نشان می‌دهد تا ببینید کدام روش برای شما ارزان‌تر تمام می‌شود.",
  },
  {
    q: "چرا باید سال فعالیت و تعداد شرکا را وارد کنم؟",
    a: "معافیت سالانه ماده ۱۰۱ و سقف پله‌های ماده ۱۳۱ هر سال با قانون بودجه تغییر می‌کند؛ پس سال عملکرد، ارقام معافیت را تعیین می‌کند. تعداد شرکا هم در تعداد معافیت اثر دارد: در مشارکت‌های مدنی حداکثر دو معافیت به کل شرکا تعلق می‌گیرد و زن و شوهر در حکم یک شریک هستند.",
  },
  {
    q: "ضریب اینتاکد شغلم را از کجا بیاورم؟",
    a: "ضریب دقیق شغل خود را از جدول اینتاکد (ضریب سود فعالیت) سازمان امور مالیاتی استعلام کنید. ضرایب فهرست این ابزار تقریبی و برای برآورد اولیه است؛ برای دقت کامل، گزینه «سایر (ورود دستی ضریب)» را انتخاب کنید و ضریب دقیق را وارد کنید.",
  },
  {
    q: "اگر روش تبصره ۱۰۰ ارزان‌تر بود، حتماً باید همان را انتخاب کنم؟",
    a: "خیر. استفاده از تبصره ۱۰۰ شرط دارد: فروش سالانه زیر سقف اعلامی سازمان امور مالیاتی، نبود تراکنش نامتناسب و رعایت شرایط اعلامی هر سال. این ابزار فقط هزینه دو روش را مقایسه می‌کند و شرایط پذیرش شما را تأیید نمی‌کند.",
  },
  {
    q: "چرا گاهی مالیات یکی از دو روش صفر می‌شود؟",
    a: "اگر درآمد مشمول یک روش (بعد از کسر معافیت ماده ۱۰۱) صفر یا منفی شود، مالیات آن روش صفر خواهد بود؛ مثلاً وقتی هزینه‌های مستند تمام سود را می‌بلعند یا فروش ضربدر ضریب، کمتر از معافیت سالانه است.",
  },
  {
    q: "نتیجه این ابزار قطعی است؟",
    a: "خیر؛ نتیجه یک برآورد آموزشی است. عدد نهایی به هزینه‌های قابل قبول تأییدشده، ضریب رسمی اینتاکد، وضعیت سامانه مودیان و نظر کارشناس پرونده بستگی دارد. برای پرونده‌های مهم حتماً با مشاور مالیاتی مشورت کنید.",
  },
];

export function CompareCalculator({ onGoHub }: { onGoHub: () => void }) {
  const { toast } = useToast();

  const [sales, setSales] = useState("");
  const [expense, setExpense] = useState("");
  const [year, setYear] = useState("1405");
  const [partners, setPartners] = useState("single");
  const [job, setJob] = useState("");
  const [customCoef, setCustomCoef] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [resultTab, setResultTab] = useState<"sheet" | "excel" | "analysis">("sheet");

  const yearData = TAX_YEARS[year];
  const partnerCount =
    PARTNER_OPTIONS.find((p) => p.value === partners)?.count ?? 1;
  const selectedJob = JOBS.find((j) => j.name === job);
  const coef =
    job === "__custom"
      ? parseMoney(customCoef) / 100 || 0
      : selectedJob?.coef ?? 0;

  const rows = useMemo(() => {
    if (!result) return null;
    return [
      { label: "سود خالص (فروش منهای هزینه)", value: result.netProfit, bold: false },
      { label: "درآمد مشمول با ضریب اینتاکد", value: result.coefIncome, bold: false },
      {
        label: `معافیت سالانه ماده ۱۰۱ (${faNum(result.exemptionCount)} × ${faNum(result.exemptionTotal / result.exemptionCount)})`,
        value: result.exemptionTotal,
        bold: false,
      },
      {
        label: "درآمد مشمول بعد از معافیت (اظهارنامه)",
        value: result.ehtar.taxable,
        bold: false,
      },
      { label: "پله ۱۵٪ (اظهارنامه)", value: result.ehtar.tax.b15, bold: false },
      { label: "پله ۲۰٪ (اظهارنامه)", value: result.ehtar.tax.b20, bold: false },
      { label: "پله ۲۵٪ (اظهارنامه)", value: result.ehtar.tax.b25, bold: false },
      { label: "جمع مالیات روش اظهارنامه", value: result.ehtar.tax.total, bold: true },
      {
        label: "درآمد مشمول بعد از معافیت (تبصره ۱۰۰)",
        value: result.tabsare.taxable,
        bold: false,
      },
      { label: "پله ۱۵٪ (تبصره ۱۰۰)", value: result.tabsare.tax.b15, bold: false },
      { label: "پله ۲۰٪ (تبصره ۱۰۰)", value: result.tabsare.tax.b20, bold: false },
      { label: "پله ۲۵٪ (تبصره ۱۰۰)", value: result.tabsare.tax.b25, bold: false },
      { label: "جمع مالیات روش تبصره ۱۰۰", value: result.tabsare.tax.total, bold: true },
    ];
  }, [result]);

  function calculate() {
    const salesNum = parseMoney(sales);
    const expenseNum = parseMoney(expense);

    if (!salesNum) {
      toast({
        title: "ورود فروش الزامی است",
        description: "لطفاً مبلغ فروش دوره را به ریال وارد کنید.",
      });
      return;
    }
    if (!job) {
      toast({
        title: "انتخاب عنوان شغلی الزامی است",
        description: "شغل خود را از فهرست انتخاب کنید یا ضریب را دستی وارد کنید.",
      });
      return;
    }
    if (job === "__custom" && !coef) {
      toast({
        title: "ضریب نامعتبر است",
        description: "ضریب سود فعالیت را بین ۰ تا ۱۰۰ درصد وارد کنید.",
      });
      return;
    }

    const net = Math.max(0, salesNum - expenseNum);
    const coefIncome = salesNum * (coef / 100);
    const exemptionTotal = yearData.exemption * partnerCount;

    const ehtarTaxable = Math.max(0, net - exemptionTotal);
    const tabsareTaxable = Math.max(0, coefIncome - exemptionTotal);

    const ehtar = {
      taxable: ehtarTaxable,
      tax: progressiveTax(ehtarTaxable, yearData.b1, yearData.b2),
    };
    const tabsare = {
      taxable: tabsareTaxable,
      tax: progressiveTax(tabsareTaxable, yearData.b1, yearData.b2),
    };

    const diff = ehtar.tax.total - tabsare.tax.total;
    setResult({
      netProfit: net,
      coefIncome,
      exemptionTotal,
      exemptionCount: partnerCount,
      ehtar,
      tabsare,
      saving: Math.abs(diff),
      better: diff > 1 ? "tabsare" : diff < -1 ? "ehtar" : "equal",
      underCeiling: salesNum <= yearData.ceiling,
      coef,
      year,
    });
    setResultTab("sheet");
    toast({
      title: "محاسبه انجام شد",
      description: "برگه نتیجه در پایین صفحه فعال شد.",
    });
  }

  function exportExcel() {
    if (!result || !rows) return;
    const header = ["ردیف", "شرح", "مبلغ (ریال)"];
    const lines: (string | number)[][] = rows.map((r, i) => [
      i + 1,
      r.label,
      r.value,
    ]);
    lines.push(["", "صرفه‌جویی با انتخاب روش بهتر", result.saving]);
    lines.push([
      "",
      "روش پیشنهادی",
      result.better === "ehtar"
        ? "اظهارنامه"
        : result.better === "tabsare"
          ? "تبصره ۱۰۰"
          : "برابر",
    ]);
    lines.push([
      "",
      "وضعیت سقف فروش تبصره ۱۰۰",
      result.underCeiling ? "زیر سقف (مشمول)" : "بالای سقف (مشمول نیست)",
    ]);
    const csv =
      "\uFEFF" +
      [header, ...lines]
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
        .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compare-tax-methods-${result.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1" />
                در چند ثانیه بفهم کدام روش مالیاتی برایت ارزان‌تر است
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                مقایسه مالیات اظهارنامه و{" "}
                <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">
                  تبصره ۱۰۰
                </mark>
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                فروش، هزینه و عنوان شغل را وارد کنید تا مالیات روش اظهارنامه و
                روش تبصره ۱۰۰ کنار هم و پله‌به‌پله محاسبه شود و ببینید کدام روش
                برای شما کم‌هزینه‌تر است.
              </p>
              <Button
                onClick={() =>
                  document
                    .getElementById("calculator-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-6 bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-5"
              >
                شروع محاسبه
                <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related tools tab strip */}
      <section className="py-2">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
            {[
              "مالیات مشاغل",
              "مالیات مقطوع تبصره ۱۰۰",
              "مقایسه اظهارنامه و تبصره ۱۰۰",
              "مالیات شرکت‌ها",
              "مالیات حساب بانکی",
              "مالیات چک",
              "حق تمبر (ماده ۱۰۳)",
              "مهلت‌های دادرسی",
            ].map((t) => {
              const active = t === "مقایسه اظهارنامه و تبصره ۱۰۰";
              return (
                <button
                  key={t}
                  onClick={
                    active
                      ? undefined
                      : () => {
                          onGoHub();
                          toast({
                            title: "به فهرست ابزارها منتقل شدید",
                            description:
                              "این ابزار در صفحه «همه محاسبه‌گرها» فهرست شده است.",
                          });
                        }
                  }
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    active
                      ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator-form" className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-xl font-extrabold text-slate-900">
              مقایسه مالیات اظهارنامه و تبصره ۱۰۰
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              اطلاعات پایه پرونده عملکرد خود را وارد کنید.
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Field label="فروش دوره (ریال)" required>
                <Input
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="0"
                  value={sales}
                  onChange={(e) => setSales(formatMoneyInput(e.target.value))}
                  className="text-left h-11"
                />
              </Field>

              <Field label="هزینه و استهلاک (ریال)" required>
                <Input
                  dir="ltr"
                  inputMode="numeric"
                  placeholder="0"
                  value={expense}
                  onChange={(e) => setExpense(formatMoneyInput(e.target.value))}
                  className="text-left h-11"
                />
              </Field>

              <Field label="سال فعالیت" required>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(TAX_YEARS).map((y) => (
                      <SelectItem key={y} value={y}>
                        سال {toFaDigits(y)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="تعداد شرکاء" required>
                <Select value={partners} onValueChange={setPartners}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNER_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="عنوان شغلی" required hint="ضریب اینتاکد تقریبی">
                <Select value={job} onValueChange={setJob}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {JOBS.map((j) => (
                      <SelectItem key={j.name} value={j.name}>
                        {j.name} (≈ {faNum(j.coef)}٪)
                      </SelectItem>
                    ))}
                    <SelectItem value="__custom">سایر (ورود دستی ضریب)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              {job === "__custom" && (
                <Field label="ضریب سود فعالیت (درصد)" required>
                  <Input
                    dir="ltr"
                    inputMode="decimal"
                    placeholder="0 - 100"
                    value={customCoef}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "");
                      setCustomCoef(v);
                    }}
                    className="text-left h-11"
                  />
                </Field>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button
                onClick={calculate}
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6 h-11 font-bold"
              >
                <Calculator className="h-4 w-4 ml-1" />
                محاسبه نتیجه
              </Button>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                فایل‌ها و لینک نتیجه بعد از محاسبه فعال می‌شوند
              </p>
            </div>

            {yearData.note && (
              <div className="mt-5 flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-6">
                <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                {yearData.note}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Result sheet */}
      <section className="pb-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div
            className={`bg-white rounded-2xl border shadow-sm p-6 md:p-8 transition-opacity ${
              result
                ? "border-slate-200"
                : "border-slate-200/60 opacity-60 pointer-events-none select-none"
            }`}
            aria-hidden={!result}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-extrabold text-slate-900">
                برگه نتیجه محاسبه
              </h2>
              <div className="flex items-center gap-2">
                <ResultTabButton
                  active={resultTab === "sheet"}
                  onClick={() => setResultTab("sheet")}
                  icon={<FileText className="h-4 w-4" />}
                  label="برگه نتیجه"
                />
                <ResultTabButton
                  active={resultTab === "excel"}
                  onClick={() => {
                    setResultTab("excel");
                    exportExcel();
                  }}
                  icon={<FileSpreadsheet className="h-4 w-4" />}
                  label="خروجی اکسل"
                />
                <ResultTabButton
                  active={resultTab === "analysis"}
                  onClick={() => setResultTab("analysis")}
                  icon={<BarChart3 className="h-4 w-4" />}
                  label="تحلیل"
                />
              </div>
            </div>

            {!result && (
              <p className="mt-6 text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-6 text-center">
                برای مشاهده نتیجه، ابتدا فرم بالا را تکمیل و روی «محاسبه نتیجه»
                بزنید.
              </p>
            )}

            {result && resultTab === "sheet" && rows && (
              <div className="mt-6">
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {rows.map((r, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-4 px-4 py-3 ${
                        i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                      } ${r.bold ? "border-y border-yellow-200 bg-yellow-50/70" : ""}`}
                    >
                      <span
                        className={`text-sm leading-6 ${
                          r.bold
                            ? "font-extrabold text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        {r.label}
                      </span>
                      <span
                        className={`text-sm font-bold shrink-0 tabular-nums ${
                          r.bold ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {faNum(r.value)} ریال
                      </span>
                    </div>
                  ))}

                  {/* Saving + verdict */}
                  <div className="px-4 py-3 bg-slate-50/60 flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-700">
                      صرفه‌جویی با انتخاب روش بهتر
                    </span>
                    <span className="text-sm font-bold tabular-nums text-emerald-700">
                      {faNum(result.saving)} ریال
                    </span>
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between gap-4 border-y border-yellow-200 bg-yellow-50/70">
                    <span className="text-sm font-extrabold text-slate-900">
                      روش پیشنهادی (کم‌هزینه‌تر)
                    </span>
                    <Badge className="bg-yellow-400 text-slate-900 hover:bg-yellow-400 rounded-full px-3">
                      {result.better === "ehtar"
                        ? "اظهارنامه"
                        : result.better === "tabsare"
                          ? "تبصره ۱۰۰"
                          : "هر دو برابر"}
                    </Badge>
                  </div>
                  <div className="px-4 py-3 bg-slate-50/60 flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-700">
                      وضعیت سقف فروش تبصره ۱۰۰
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        result.underCeiling
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}
                    >
                      {result.underCeiling
                        ? "زیر سقف (مشمول)"
                        : "بالای سقف (مشمول نیست)"}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500 leading-6 flex items-start gap-1.5">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  محاسبات بر مبنای معافیت ماده ۱۰۱ و نرخ‌های پلکانی ماده ۱۳۱
                  سال {toFaDigits(result.year)} انجام شده
                  است؛ ضریب اینتاکد اعمال‌شده:{" "}
                  <bdi dir="ltr">{result.coef.toLocaleString("en-US")}</bdi>٪.
                </p>
              </div>
            )}

            {result && resultTab === "analysis" && (
              <AnalysisPanel result={result} />
            )}

            {result && resultTab === "excel" && (
              <p className="mt-6 text-sm text-slate-600">
                فایل اکسل برگه نتیجه دانلود شد. برای دانلود مجدد، دوباره روی
                «خروجی اکسل» بزنید.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-8">
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 rounded-full text-xs">
              <HelpCircle className="h-3.5 w-3.5 ml-1" />
              سوالات متداول
            </Badge>
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
              پاسخ پرسش‌های رایج درباره این محاسبه
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {faqItems.map((faq, i) => (
              <Accordion
                key={i}
                type="single"
                collapsible
                className="bg-white rounded-xl border border-slate-200 px-4"
              >
                <AccordionItem value={`q-${i}`} className="border-0">
                  <AccordionTrigger className="text-right hover:no-underline py-5">
                    <div className="flex items-center gap-3 text-right">
                      <span className="grid place-items-center h-8 w-8 rounded-lg bg-yellow-400 text-slate-900 text-xs font-extrabold shrink-0">
                        {(i + 1).toLocaleString("fa-IR", {
                          minimumIntegerDigits: 2,
                        })}
                      </span>
                      <span className="font-bold text-slate-900 text-sm leading-6">
                        {faq.q}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 text-sm leading-7 pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      {/* Explanations */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1 rounded-full text-xs">
              <Sparkles className="h-3.5 w-3.5 ml-1" />
              توضیحات تکمیلی
            </Badge>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              راهنمای کامل این محاسبه
            </h2>
            <h3 className="mt-6 text-lg font-bold text-slate-900">
              مقایسه مالیات اظهارنامه و تبصره ۱۰۰؛ کدام روش برای شما ارزان‌تر
              است؟
            </h3>
            <p className="mt-3 text-slate-600 text-sm leading-8">
              خیلی از صاحبان کسب‌وکار کوچک نمی‌دانند باید مالیات‌شان را با{" "}
              <b>اظهارنامه عملکرد</b> بدهند یا از <b>تبصره ماده ۱۰۰</b> استفاده
              کنند. این دو روش از دو مسیر متفاوت به مالیات می‌رسند و گاهی
              اختلاف‌شان چند برابر است. این ابزار هر دو را با یک بار ورود
              اطلاعات حساب می‌کند و کنار هم می‌گذارد.
            </p>

            <h3 className="mt-6 text-lg font-bold text-slate-900">
              تفاوت دو روش در یک نگاه
            </h3>
            <div className="mt-3 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/60">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-yellow-600" />
                  روش اظهارنامه
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-7">
                  مالیات را روی سود واقعی می‌بندد؛ یعنی فروش منهای هزینه‌های
                  قابل قبول. اگر هزینه‌های مستند زیادی دارید، معمولاً این روش
                  به نفع شماست.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/60">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-yellow-600" />
                  روش تبصره ۱۰۰
                </h4>
                <p className="mt-2 text-sm text-slate-600 leading-7">
                  کاری به هزینه ندارد؛ فروش را در ضریب سود فعالیت (اینتاکد)
                  شغل شما ضرب می‌کند و سود را برآورد می‌کند. اگر ضریب شغل‌تان
                  پایین باشد یا هزینه مستند کمی داشته باشید، این روش معمولاً
                  ارزان‌تر درمی‌آید.
                </p>
              </div>
            </div>

            <h3 className="mt-6 text-lg font-bold text-slate-900">
              در هر دو روش، سه مرحله مشترک است
            </h3>
            <ol className="mt-3 list-decimal list-inside space-y-2 text-sm text-slate-600 leading-7 pr-1">
              <li>
                رسیدن به درآمد مشمول (در اظهارنامه: فروش منهای هزینه؛ در
                تبصره ۱۰۰: فروش ضربدر ضریب اینتاکد).
              </li>
              <li>کسر معافیت سالانه ماده ۱۰۱.</li>
              <li>
                اعمال نرخ پلکانی ۱۵، ۲۰ و ۲۵ درصدی ماده ۱۳۱. خروجی این ابزار
                هر سه مرحله را برای هر دو روش جدا نشان می‌دهد تا ببینید عدد از
                کجا آمده.
              </li>
            </ol>

            <h3 className="mt-6 text-lg font-bold text-slate-900">
              چند نکته مهم
            </h3>
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-2 text-sm text-slate-600 leading-7">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-1" />
                <p>
                  <b className="text-slate-900">سال را درست انتخاب کنید؛</b>{" "}
                  معافیت ماده ۱۰۱ و سقف پله‌های ماده ۱۳۱ هر سال با قانون بودجه
                  عوض می‌شود.
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-600 leading-7">
                <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-1" />
                <p>
                  <b className="text-slate-900">
                    ارزان‌تر بودن، به معنی مجاز بودن نیست؛
                  </b>{" "}
                  استفاده از تبصره ۱۰۰ شرط دارد، مثل فروش زیر سقف اعلامی و نبود
                  تراکنش نامتناسب. این ابزار فقط مالیات دو روش را مقایسه می‌کند
                  و شرایط پذیرش را بررسی نمی‌کند.
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-slate-500 leading-7 bg-slate-50 border border-slate-200 rounded-xl p-4">
              مبنای قانونی: مواد ۹۵ تا ۱۰۱، تبصره ماده ۱۰۰ و ماده ۱۳۱ قانون
              مالیات‌های مستقیم و احکام مالیاتی قانون بودجه سالانه. ضرایب فهرست
              مشاغل تقریبی است؛ ضریب رسمی را از جدول اینتاکد سازمان امور
              مالیاتی استعلام کنید. این ابزار جایگزین مشاوره تخصصی نیست.
            </p>
          </div>
        </div>
      </section>

      {/* Comments */}
      <section className="py-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-extrabold text-slate-900">نظرات</h2>
              <Badge className="bg-slate-100 text-slate-700 border-slate-200 rounded-full px-3">
                ۰ دیدگاه
              </Badge>
            </div>
            <div className="mt-4 text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-xl p-8 text-center">
              هنوز دیدگاهی ثبت نشده است. اولین نفر باشید!
            </div>
            <div className="mt-4 flex justify-center">
              <Button
                onClick={() =>
                  toast({
                    title: "ثبت دیدگاه",
                    description:
                      "برای ثبت دیدگاه ابتدا وارد حساب کاربری خود شوید.",
                  })
                }
                variant="outline"
                className="rounded-full border-slate-300 text-slate-700 hover:bg-yellow-50 hover:border-yellow-400"
              >
                <BadgeCheck className="h-4 w-4 ml-1" />
                ثبت دیدگاه
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
        {hint && (
          <span className="text-[11px] font-normal text-slate-400 mr-1">
            ({hint})
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function ResultTabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-colors border ${
        active
          ? "bg-slate-900 text-white border-slate-900"
          : "bg-white text-slate-600 border-slate-200 hover:border-yellow-400 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function AnalysisPanel({ result }: { result: Result }) {
  const cheaper =
    result.better === "ehtar"
      ? "اظهارنامه"
      : result.better === "tabsare"
        ? "تبصره ۱۰۰"
        : "هر دو روش";
  const reason =
    result.better === "ehtar"
      ? "سود واقعی اظهارشده شما (فروش منهای هزینه) نسبت به برآورد ضریبی پایین‌تر درمی‌آید؛ یعنی هزینه‌های مستند قابل قبول زیادی دارید. در این حالت روش اظهارنامه مالیات کمتری می‌دهد، اما نگهداری دفاتر و مدارک و پذیرش ریسک رسیدگی را در بر دارد."
      : result.better === "tabsare"
        ? "ضریب سود فعالیت شغل شما نسبت به سهم هزینه‌هایتان پایین است یا هزینه مستند کافی ندارید. روش تبصره ۱۰۰ مالیات کمتری می‌دهد؛ فقط یادتان باشد استفاده از آن شرط دارد: فروش زیر سقف اعلامی، نبود تراکنش نامتناسب و رعایت دستورالعمل سالانه سازمان امور مالیاتی."
        : "مالیات دو روش عملاً برابر است؛ انتخاب روش را می‌توانید بر اساس سادگی تکالیف و شرایط پذیرش هر روش انجام دهید.";

  const coefShare =
    result.netProfit > 0
      ? Math.round((result.coefIncome / result.netProfit) * 100)
      : 0;

  return (
    <div className="mt-6 space-y-4">
      <div className="rounded-xl border border-yellow-200 bg-yellow-50/70 p-5">
        <h3 className="font-extrabold text-slate-900 flex items-center gap-2">
          <BadgeCheck className="h-5 w-5 text-emerald-600" />
          جمع‌بندی: روش پیشنهادی شما «{cheaper}» است
        </h3>
        <p className="mt-2 text-sm text-slate-700 leading-7">{reason}</p>
        <p className="mt-2 text-sm font-bold text-emerald-700">
          صرفه‌جویی تقریبی: {faNum(result.saving)} ریال
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <MiniStat
          title="سود خالص اظهارنامه"
          value={`${faNum(result.netProfit)} ریال`}
        />
        <MiniStat
          title="برآورد سود ضریبی (اینتاکد)"
          value={`${faNum(result.coefIncome)} ریال`}
        />
        <MiniStat
          title="نسبت برآورد ضریبی به سود واقعی"
          value={
            result.netProfit > 0
              ? `${faNum(coefShare)}٪`
              : "—"
          }
        />
      </div>

      <div className="rounded-xl border border-slate-200 p-5">
        <h4 className="font-bold text-slate-900 text-sm mb-2">
          سه مرحله محاسبه (مشترک در هر دو روش)
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-slate-600 leading-7">
          <li>
            درآمد مشمول: اظهارنامه {faNum(result.ehtar.taxable)} ریال / تبصره
            ۱۰۰ {faNum(result.tabsare.taxable)} ریال
          </li>
          <li>معافیت ماده ۱۰۱: {faNum(result.exemptionTotal)} ریال</li>
          <li>
            مالیات پلکانی ماده ۱۳۱: اظهارنامه {faNum(result.ehtar.tax.total)}{" "}
            ریال / تبصره ۱۰۰ {faNum(result.tabsare.tax.total)} ریال
          </li>
        </ol>
        <p className="mt-3 text-xs text-slate-500 leading-6 flex items-start gap-1.5">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          این تحلیل آموزشی است و جایگزین بررسی تخصصی پرونده نیست؛ برای
          پرونده‌های حساس با مشاور مالیاتی مشورت کنید.
        </p>
      </div>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-slate-900 rounded-xl p-4">
      <span className="text-xs text-slate-300 block">{title}</span>
      <span className="text-sm font-extrabold text-yellow-400 mt-1 block">
        {value}
      </span>
    </div>
  );
}
