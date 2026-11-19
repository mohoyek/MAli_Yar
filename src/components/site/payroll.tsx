"use client";

import { useState } from "react";
import {
  Wallet,
  ChevronLeft,
  HelpCircle,
  Info,
  ArrowRight,
  ShieldCheck,
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
import { faNum, faPercent, faNumDec, parseMoney } from "@/lib/format";
import { SALARY_BRACKETS, SSO_1405, capDaily, progressiveTax } from "@/lib/tax";

type Result = {
  gross: number;
  insuredGross: number;
  employeeIns: number;
  employerIns: number;
  monthlyTax: number;
  net: number;
  employerCost: number;
  aboveCap: boolean;
  capMonthly: number;
};

const faqItems = [
  {
    q: "بیمه تأمین اجتماعی چند درصد است؟",
    a: "سهم کارمند ۷ درصد و سهم کارفرما ۲۳ درصد از حقوق و مزایای مشمول بیمه است (مجموع ۳۰ درصد). حق اولاد مشمول بیمه نیست و در مبنای کسر لحاظ نمی‌شود.",
  },
  {
    q: "سقف حقوق مشمول بیمه در ۱۴۰۵ چقدر است؟",
    a: "سقف دستمزد روزانه مشمول کسر حق بیمه در ۱۴۰۵ برابر ۷ برابر حداقل دستمزد روزانه، یعنی ۳۸٬۷۹۲٬۹۵۰ ریال است. برای ماه ۳۱ روزه سقف ماهانه حدود ۱٬۲۰۲٬۵۸۱٬۴۵۰ ریال می‌شود؛ مازاد بر آن مشمول کسر بیمه نیست.",
  },
  {
    q: "مالیات حقوق در محاسبه خالص چطور لحاظ می‌شود؟",
    a: "مالیات حقوق طبق ماده ۸۴ و پله‌های بودجه ۱۴۰۵ از کل حقوق ناخالص محاسبه و کسر می‌شود. خالص دریاختی = حقوق ناخالص منهای سهم بیمه کارمند (۷٪) منهای مالیات حقوق.",
  },
  {
    q: "هزینه کل کارفرما برای هر کارمند چقدر است؟",
    a: "هزینه کل کارفرما = حقوق ناخالص + سهم بیمه کارفرما (۲۳٪ از حقوق مشمول بیمه). این رقم نشان می‌دهد هر کارمند واقعاً چه هزینه‌ای برای کارفرما دارد.",
  },
  {
    q: "نتیجه قطعی است؟",
    a: "نتیجه یک برآورد آموزشی با مفروضات استاندارد ۱۴۰۵ است. مزایای غیرنقدی، حق اولاد، عیدی و سنوات وضعیت خاص خود را دارند. برای فیش واقعی با واحد حقوق و دستمزد هماهنگ کنید.",
  },
];

export function PayrollCalculator({ onGoHome }: { onGoHome: () => void }) {
  const { toast } = useToast();
  const [income, setIncome] = useState("");
  const [days, setDays] = useState("31");
  const [year, setYear] = useState("1405");
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const gross = parseMoney(income);
    if (!gross || gross < 0) {
      toast({
        title: "حقوق ناخالص را وارد کنید",
        description: "مبلغ حقوق ناخالص ماهانه را به ریال وارد کنید.",
      });
      return;
    }
    const d = Number(days);
    const capMonthly = capDaily(year) * d;
    const insuredGross = Math.min(gross, capMonthly);
    const employeeIns = insuredGross * SSO_1405.employeeRate;
    const employerIns = insuredGross * SSO_1405.employerRate;
    const { total } = progressiveTax(gross, SALARY_BRACKETS[year].monthly);
    const net = gross - employeeIns - total;
    setResult({
      gross,
      insuredGross,
      employeeIns,
      employerIns,
      monthlyTax: total,
      net,
      employerCost: gross + employerIns,
      aboveCap: gross > capMonthly,
      capMonthly,
    });
    toast({ title: "محاسبه انجام شد", description: "خالص دریاختی و هزینه کارفرما محاسبه شد." });
  }

  function reset() {
    setIncome("");
    setResult(null);
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
                حقوق و دستمزد — بیمه + مالیات
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                محاسبه <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">خالص دریاختی</mark> و هزینه کارفرما
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                حقوق ناخالص ماهانه را وارد کنید تا سهم بیمه کارمند (۷٪)، سهم بیمه
                کارفرما (۲۳٪)، مالیات حقوق (ماده ۸۴) و در نهایت خالص دریاختی و
                هزینه کل کارفرما محاسبه شود.
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
            <div className="grid md:grid-cols-[1fr_180px_180px] gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  حقوق ناخالص ماهانه (ریال)
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
                <label className="block text-sm font-medium text-slate-700 mb-2">روزهای ماه</label>
                <Select value={days} onValueChange={setDays}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="31">۳۱ روزه</SelectItem>
                    <SelectItem value="30">۳۰ روزه</SelectItem>
                    <SelectItem value="29">۲۹ روزه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">سال</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1405">۱۴۰۵</SelectItem>
                    <SelectItem value="1404">۱۴۰۴</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                onClick={calculate}
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
              >
                <Wallet className="h-4 w-4 ml-1" /> محاسبه حقوق و دستمزد
              </Button>
              <Button variant="outline" onClick={reset} className="rounded-full">
                پاک کردن
              </Button>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-6 flex items-start gap-1">
              <Info className="h-4 w-4 shrink-0 mt-0.5" /> مفروضات ۱۴۰۵: حداقل دستمزد روزانه ۵٬۵۴۱٬۸۵۰ ریال، سقف بیمه ۷ برابر آن، سهم کارمند ۷٪ و کارفرما ۲۳٪. مالیات حقوق طبق پله‌های ماده ۸۴ از کل حقوق ناخالص محاسبه می‌شود.
            </p>
          </div>
        </div>
      </section>

      {result && (
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Stat label="حقوق ناخالص" value={faNum(result.gross)} unit="ریال" />
              <Stat label="بیمه کارمند (۷٪)" value={faNum(result.employeeIns)} unit="ریال" />
              <Stat label="مالیات حقوق" value={faNum(result.monthlyTax)} unit="ریال" />
              <Stat label="خالص دریاختی" value={faNum(result.net)} unit="ریال" accent />
              <Stat label="بیمه کارفرما (۲۳٪)" value={faNum(result.employerIns)} unit="ریال" />
              <Stat label="هزینه کل کارفرما" value={faNum(result.employerCost)} unit="ریال" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-yellow-500" /> جزئیات بیمه و مبنای کسر
              </h2>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <Row label="حقوق مشمول بیمه (تا سقف)" value={`${faNum(result.insuredGross)} ریال`} />
                <Row label="سقف ماهانه بیمه (۱۴۰۵)" value={`${faNum(result.capMonthly)} ریال`} />
                <Row label="مازاد بر سقف (غیرمشمول)" value={`${faNum(Math.max(0, result.gross - result.capMonthly))} ریال`} />
                <Row label="نرخ مؤثر مالیات" value={faPercent(result.gross > 0 ? result.monthlyTax / result.gross : 0)} />
              </div>
              {result.aboveCap && (
                <p className="mt-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 leading-6">
                  حقوق این کارمند بالاتر از سقف بیمه ۱۴۰۵ است؛ حق بیمه فقط تا {faNum(result.capMonthly)} ریال (سقف ماهانه) محاسبه می‌شود.
                </p>
              )}
              <p className="mt-4 text-xs text-slate-500 leading-6">
                خالص دریاختی = حقوق ناخالص − {faNumDec(result.employeeIns, 0)} (بیمه کارمند) − {faNumDec(result.monthlyTax, 0)} (مالیات) = {faNum(result.net)} ریال.
              </p>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold tabular-nums text-slate-900">{value}</span>
    </div>
  );
}
