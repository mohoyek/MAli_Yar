"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  ChevronLeft,
  HelpCircle,
  Info,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { faNum, faNumDec, faPercent, parseMoney } from "@/lib/format";
import {
  parseJalali,
  formatJalali,
  jalaliToDayNumber,
  dayNumberToJalali,
  todayJalali,
} from "@/lib/jalali";

type CheckRow = { id: number; amount: string; date: string };

type Parsed = {
  amount: number;
  dn: number;
  dateLabel: string;
};

const faqItems = [
  {
    q: "راس‌گیری چک چیست و کجا کاربرد دارد؟",
    a: "راس (تاریخ میانگین موزون) مجموعه‌ای از چک‌ها، تاریخ فرضی یک چک است که مجموع مبلغ همه چک‌ها در آن تاریخ سررسید شده فرض شود. در حسابداری برای برآورد میانگین زمان وصول چک‌های دریافتی و محاسبه بهای تمام‌شده پول در زمان از یک گیره چک استفاده می‌شود.",
  },
  {
    q: "فرمول راس‌گیری چگونه است؟",
    a: "راس = (مجموع (مبلغ هر چک × شماره روز سررسید آن)) ÷ (مجموع مبالغ). شماره روز، فاصله‌ی هر تاریخ از یک مبنای ثابت است؛ بعد از محاسبه میانگین موزون، عدد به تاریخ شمسی برگردانده می‌شود.",
  },
  {
    q: "تاریخ‌ها را با چه فرمتی وارد کنم؟",
    a: "تاریخ شمسی به‌صورت سال/ماه/روز وارد می‌شود؛ مثلاً ۱۴۰۵/۰۹/۲۰. ارقام فارسی یا انگلیسی و جداکننده‌های / و - پذیرفته می‌شود.",
  },
  {
    q: "چک‌های بدون مبلغ یا تاریخ نامعتبر چه می‌شوند؟",
    a: "ردیف‌هایی که مبلغ صفر دارند یا تاریخشان معتبر نیست، در محاسبه نادیده گرفته می‌شوند؛ در جدول نتیجه با علامت «نامعتبر» مشخص می‌شوند.",
  },
];

let nextId = 3;

export function CheckDueCalculator({ onGoHome }: { onGoHome: () => void }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<CheckRow[]>([
    { id: 1, amount: "", date: "" },
    { id: 2, amount: "", date: "" },
  ]);

  function addRow() {
    setRows((r) => [...r, { id: nextId++, amount: "", date: "" }]);
  }
  function removeRow(id: number) {
    setRows((r) => (r.length > 1 ? r.filter((x) => x.id !== id) : r));
  }
  function update(id: number, key: "amount" | "date", val: string) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: val } : x)));
  }
  function loadSample() {
    const t = todayJalali();
    const future = (days: number) => {
      const dn = jalaliToDayNumber(t.year, t.month, t.day) + days;
      return formatJalali(dayNumberToJalali(dn));
    };
    setRows([
      { id: nextId++, amount: "500000000", date: future(15) },
      { id: nextId++, amount: "800000000", date: future(45) },
      { id: nextId++, amount: "1200000000", date: future(90) },
    ]);
    toast({ title: "نمونه بارگذاری شد", description: "سه چک نمونه با سررسید آینده وارد شد." });
  }

  const parsed = useMemo<Parsed[]>(() => {
    return rows.map((r) => {
      const amount = parseMoney(r.amount);
      const d = parseJalali(r.date);
      if (amount > 0 && d) {
        return { amount, dn: jalaliToDayNumber(d.year, d.month, d.day), dateLabel: formatJalali(d) };
      }
      return { amount, dn: NaN, dateLabel: r.date || "—" };
    });
  }, [rows]);

  const valid = parsed.filter((p) => p.amount > 0 && !isNaN(p.dn));
  const total = valid.reduce((s, p) => s + p.amount, 0);
  const weightedDn = total > 0 ? valid.reduce((s, p) => s + p.amount * p.dn, 0) / total : NaN;
  const ras = !isNaN(weightedDn) ? dayNumberToJalali(Math.round(weightedDn)) : null;

  return (
    <div className="min-h-screen">
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <button
                onClick={onGoHome}
                className="text-sm text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-4"
              >
                <ArrowRight className="h-4 w-4" /> بازگشت به خانه
              </button>
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1" />
                حسابداری — راس‌گیری چک
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                محاسبه <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">راس</mark> مجموعه چک
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                مبلغ و تاریخ سررسید هر چک (شمسی) را وارد کنید تا تاریخ میانگین موزون
                (راس) و مجموع مبلغ چک‌ها به‌صورت زنده محاسبه شود. ابزار برای
                برآورد زمان وصول گیره چک دریافتی کاربرد دارد.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-5"
                >
                  افزودن چک <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
                <Button variant="outline" onClick={onGoHome} className="rounded-full">
                  سایر ابزارها
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calc" className="pb-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900">فهرست چک‌ها</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSample} className="rounded-full">
                  <Sparkles className="h-4 w-4 ml-1" /> نمونه
                </Button>
                <Button size="sm" onClick={addRow} className="rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                  <Plus className="h-4 w-4 ml-1" /> افزودن چک
                </Button>
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[1fr_220px_44px] gap-3 px-2 pb-2 text-xs text-slate-500">
              <span>مبلغ چک (ریال)</span>
              <span>تاریخ سررسید (شمسی)</span>
              <span />
            </div>
            <div className="space-y-2">
              {rows.map((r, i) => {
                const p = parsed[i];
                const invalid = r.amount || r.date ? isNaN(p.dn) || p.amount <= 0 : false;
                return (
                  <div key={r.id} className="grid grid-cols-1 md:grid-cols-[1fr_220px_44px] gap-2 md:gap-3 items-center">
                    <Input
                      inputMode="numeric"
                      value={r.amount}
                      onChange={(e) => update(r.id, "amount", e.target.value)}
                      placeholder="مبلغ به ریال"
                      className="h-11"
                    />
                    <Input
                      value={r.date}
                      onChange={(e) => update(r.id, "date", e.target.value)}
                      placeholder="۱۴۰۵/۰۹/۲۰"
                      className={`h-11 ${invalid ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(r.id)}
                      className="text-slate-400 hover:text-red-500"
                      aria-label="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 text-xs text-slate-500 leading-6 flex items-start gap-1">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              محاسبه به‌صورت زنده انجام می‌شود؛ ردیف‌های بدون مبلغ یا با تاریخ نامعتبر در نتیجه لحاظ نمی‌شوند.
            </p>
          </div>
        </div>
      </section>

      {ras && total > 0 && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-1 bg-yellow-400 text-slate-900 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarClock className="h-5 w-5" /> راس مجموعه چک‌ها
                </div>
                <div className="mt-2 text-3xl font-extrabold tabular-nums" dir="ltr">
                  {formatJalali(ras)}
                </div>
                <div className="mt-1 text-xs text-slate-800/70">تاریخ میانگین موزون سررسید</div>
              </div>
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <Stat label="تعداد چک معتبر" value={faNum(valid.length)} />
                <Stat label="مجموع مبلغ چک‌ها" value={faNum(total)} unit="ریال" accent />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-bold text-slate-900">جزئیات چک‌ها</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs">
                    <tr>
                      <th className="text-right px-6 py-3 font-medium">ردیف</th>
                      <th className="text-left px-6 py-3 font-medium">مبلغ (ریال)</th>
                      <th className="text-left px-6 py-3 font-medium">سررسید (شمسی)</th>
                      <th className="text-left px-6 py-3 font-medium">وزن در مجموع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsed.map((p, i) => {
                      const ok = p.amount > 0 && !isNaN(p.dn);
                      return (
                        <tr key={i}>
                          <td className="px-6 py-3 text-slate-500">{faNum(i + 1)}</td>
                          <td className="px-6 py-3 text-left tabular-nums">{faNum(p.amount)}</td>
                          <td className="px-6 py-3 text-left tabular-nums">
                            {ok ? (
                              p.dateLabel
                            ) : (
                              <span className="text-red-500 text-xs">نامعتبر</span>
                            )}
                          </td>
                          <td className="px-6 py-3 text-left tabular-nums">
                            {ok ? faPercent(p.amount / total, 1) : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-yellow-50">
                      <td className="px-6 py-3 font-bold text-slate-900">جمع</td>
                      <td className="px-6 py-3 text-left tabular-nums font-extrabold text-slate-900">{faNum(total)}</td>
                      <td className="px-6 py-3 text-left tabular-nums font-bold text-slate-900">راس: {formatJalali(ras)}</td>
                      <td className="px-6 py-3 text-left tabular-nums font-bold">۱۰۰٪</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 text-xs text-slate-500 leading-6">
                راس = (Σ مبلغᵢ × روزِ سررسیدᵢ) ÷ Σ مبلغ = {faNumDec(weightedDn, 1)} (روز پایه) ← {formatJalali(ras)}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-yellow-500" /> سوالات متداول
          </h2>
          <Accordion type="single" collapsible className="bg-white rounded-2xl border border-slate-200 px-4">
            {faqItems.map((f, i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger className="text-right text-sm font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-7">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "bg-yellow-50 border-yellow-200" : "bg-white border-slate-200"
      }`}
    >
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`mt-1 text-lg md:text-xl font-extrabold tabular-nums ${
          accent ? "text-yellow-800" : "text-slate-900"
        }`}
      >
        {value}
      </div>
      {unit && <div className="text-[10px] text-slate-400 mt-0.5">{unit}</div>}
    </div>
  );
}
