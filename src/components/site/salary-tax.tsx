"use client";

import { useState } from "react";
import {
  Calculator,
  ChevronLeft,
  HelpCircle,
  Info,
  ArrowRight,
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
import { faNum, faPercent, parseMoney } from "@/lib/format";
import { SALARY_BRACKETS, progressiveTax, type BracketSlice, type Bracket } from "@/lib/tax";

type Result = {
  gross: number;
  perBracket: BracketSlice[];
  monthlyTax: number;
  annualTax: number;
  annualGross: number;
  net: number;
  effectiveRate: number;
};

const faqItems = [
  {
    q: "مالیات حقوق چگونه محاسبه می‌شود؟",
    a: "مالیات حقوق طبق ماده ۸۴ قانون مالیات‌های مستقیم و تبصره ۱۲ قانون بودجه، به‌صورت پلکانی است: ابتدا سقف معافیت ماهانه از حقوق مشمول کسر می‌شود و فقط مازاد وارد پله‌های ۱۰، ۱۵، ۲۰، ۲۵ و ۳۰ درصد می‌شود. کارفرما موظف است مالیات را کسر و به سازمان امور مالیاتی پرداخت کند.",
  },
  {
    q: "سقف معافیت حقوق ۱۴۰۵ چقدر است؟",
    a: "در عملکرد ۱۴۰۵ سقف معافیت ماهانه ۴۰ میلیون تومان (۴۰۰ میلیون ریال) و سالانه ۴۸۰ میلیون تومان است. حقوق تا این مبلغ از مالیات معاف است.",
  },
  {
    q: "تفاوت محاسبه ماهانه و سالانه چیست؟",
    a: "پله‌های سالانه دقیقاً ۱۲ برابر پله‌های ماهانه هستند؛ بنابراین مجموع مالیات ۱۲ ماه برابر با مالیات سالانه است. این ابزار حقوق ماهانه را می‌گیرد و هم ماهانه و هم سالانه (ضرب در ۱۲) را نشان می‌دهد.",
  },
  {
    q: "بیمه و سایر کسورات کجا حساب می‌شود؟",
    a: "این ابزار فقط مالیات حقوق (ماده ۸۴) را محاسبه می‌کند. برای کسر بیمه تأمین اجتماعی (۷ درصد کارمند) و رسیدن به خالص دریاختی، از ابزار «محاسبه حقوق و دستمزد» استفاده کنید.",
  },
  {
    q: "نتیجه قطعی است؟",
    a: "نتیجه یک برآورد آموزشی بر اساس نرخ‌های قانون بودجه است. پرداخت‌های معاف (سنوات، بازخرید مرخصی، خسارت اخراج و...) در این محاسبه لحاظ نشده‌اند. برای فیش واقعی با مشاور مالیاتی یا واحد حقوق‌ و دستمزد هماهنگ کنید.",
  },
];

export function SalaryTaxCalculator({ onGoHome }: { onGoHome: () => void }) {
  const { toast } = useToast();
  const [income, setIncome] = useState("");
  const [year, setYear] = useState("1405");
  const [result, setResult] = useState<Result | null>(null);
  const data = SALARY_BRACKETS[year];

  function calculate() {
    const gross = parseMoney(income);
    if (!gross || gross < 0) {
      toast({
        title: "حقوق را وارد کنید",
        description: "مبلغ حقوق ماهانه را به ریال وارد کنید.",
      });
      return;
    }
    const { perBracket, total } = progressiveTax(gross, data.monthly);
    setResult({
      gross,
      perBracket,
      monthlyTax: total,
      annualTax: total * 12,
      annualGross: gross * 12,
      net: gross - total,
      effectiveRate: gross > 0 ? total / gross : 0,
    });
    toast({
      title: "محاسبه انجام شد",
      description: "نتیجه در پایین صفحه نمایش داده شد.",
    });
  }

  function reset() {
    setIncome("");
    setResult(null);
  }

  function bracketLabel(i: number, brackets: Bracket[]) {
    const prev = i === 0 ? 0 : brackets[i - 1].upTo;
    const cur = brackets[i].upTo;
    const isInf = !isFinite(cur);
    return `از ${faNum(prev)} تا ${isInf ? "مازاد" : faNum(cur)} ریال`;
  }

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
                مالیات حقوق — ماده ۸۴
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                محاسبه <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">مالیات حقوق</mark> ۱۴۰۵
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                حقوق ماهانه را وارد کنید تا مالیات حقوق طبق پله‌های قانون بودجه
                ۱۴۰۵ (ماده ۸۴) پله‌به‌پله محاسبه شود؛ معافیت، نرخ هر پله، نرخ
                مؤثر و خالص دریاختی هم نمایش داده می‌شود.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-5"
                >
                  شروع محاسبه <ChevronLeft className="h-4 w-4 mr-1" />
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
            <div className="grid md:grid-cols-[1fr_220px] gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  حقوق ماهانه (ریال)
                </label>
                <Input
                  inputMode="numeric"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="مثلاً ۱٬۲۰۰٬۰۰۰٬۰۰۰"
                  className="h-11 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  سال عملکرد
                </label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1405">عملکرد ۱۴۰۵</SelectItem>
                    <SelectItem value="1404">عملکرد ۱۴۰۴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={calculate}
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
              >
                <Calculator className="h-4 w-4 ml-1" /> محاسبه مالیات
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-full">
                پاک کردن
              </Button>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-6 flex items-start gap-1">
              <Info className="h-4 w-4 shrink-0 mt-0.5" /> {data.note}
            </p>
          </div>
        </div>
      </section>

      {result && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="حقوق ناخالص ماهانه" value={faNum(result.gross)} unit="ریال" />
              <Stat label="مالیات ماهانه" value={faNum(result.monthlyTax)} unit="ریال" accent />
              <Stat label="خالص قبل از بیمه" value={faNum(result.net)} unit="ریال" />
              <Stat label="نرخ مؤثر" value={faPercent(result.effectiveRate)} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">محاسبه پله‌به‌پله مالیات حقوق</h2>
                <span className="text-xs text-slate-500">سال {year}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-500 text-xs">
                    <tr>
                      <th className="text-right px-6 py-3 font-medium">پله</th>
                      <th className="text-right px-6 py-3 font-medium">نرخ</th>
                      <th className="text-left px-6 py-3 font-medium">مبلغ مشمول (ریال)</th>
                      <th className="text-left px-6 py-3 font-medium">مالیات پله (ریال)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.perBracket.map((b, i) => (
                      <tr key={i}>
                        <td className="px-6 py-3 text-slate-700">{bracketLabel(i, data.monthly)}</td>
                        <td className="px-6 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                            {faPercent(b.rate, 0)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-left tabular-nums">{faNum(b.amount)}</td>
                        <td className="px-6 py-3 text-left tabular-nums font-medium">{faNum(b.tax)}</td>
                      </tr>
                    ))}
                    <tr className="bg-yellow-50">
                      <td className="px-6 py-3 font-bold text-slate-900" colSpan={3}>
                        جمع مالیات ماهانه
                      </td>
                      <td className="px-6 py-3 text-left tabular-nums font-extrabold text-slate-900">
                        {faNum(result.monthlyTax)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-slate-100 grid sm:grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">مالیات سالانه (×۱۲)</span>
                  <span className="font-bold tabular-nums">{faNum(result.annualTax)} ریال</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">حقوق ناخالص سالانه</span>
                  <span className="font-bold tabular-nums">{faNum(result.annualGross)} ریال</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-slate-500">خالص سالانه</span>
                  <span className="font-bold tabular-nums">
                    {faNum(result.annualGross - result.annualTax)} ریال
                  </span>
                </div>
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
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-2xl border border-slate-200 px-4"
          >
            {faqItems.map((f, i) => (
              <AccordionItem key={i} value={`i${i}`}>
                <AccordionTrigger className="text-right text-sm font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-7">
                  {f.a}
                </AccordionContent>
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
