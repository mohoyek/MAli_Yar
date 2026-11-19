"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  HelpCircle,
  Info,
  Search,
  ExternalLink,
  Table2,
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
import { faNum, faPercent, toLatinDigits } from "@/lib/format";
import {
  INTACODE_ENTRIES,
  INTACODE_SECTORS,
  INTACODE_YEAR,
  INTACODE_NOTE,
} from "@/data/intacode";

const faqItems = [
  {
    q: "اینتاکد چیست؟",
    a: "اینتاکد (کد طبقه‌بندی فعالیت اقتصادی) شناسه‌ای است که سازمان امور مالیاتی به هر فعالیت اقتصادی اختصاص می‌دهد و همراه با «ضریب سود فعالیت» برای محاسبه مالیات مقطوع تبصره ۱۰۰ به‌کار می‌رود.",
  },
  {
    q: "ضریب سود فعالیت چیست؟",
    a: "ضریب سود فعالیت نسبت پیش‌فرض سود به فروش است که سازمان مالیات برای هر فعالیت تعیین می‌کند. در روش تبصره ۱۰۰، درآمد مشمول برابر است با فروش ضربدر ضریب سود فعالیت.",
  },
  {
    q: "این فهرست کامل است؟",
    a: "خیر؛ این فهرست گزیده‌ای از مشاغل رایج برای برآورد اولیه است. جدول کامل رسمی سالانه در سایت سازمان امور مالیاتی کشور قابل استعلام است و ضریب دقیق هر فعالیت ممکن است متفاوت باشد.",
  },
  {
    q: "ضریب دقیق شغل خود را از کجا بیاورم؟",
    a: "ضریب دقیق را از جدول اینتاکد سازمان امور مالیاتی استعلام کنید. در ماشین‌حساب «مقایسه اظهارنامه و تبصره ۱۰۰» هم می‌توانید ضریب را به‌صورت دستی وارد کنید تا محاسبه دقیق‌تر باشد.",
  },
];

export function IntacodeView({ onGoHome }: { onGoHome: () => void }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("");

  const filtered = useMemo(() => {
    const q = toLatinDigits(query).trim().toLowerCase();
    return INTACODE_ENTRIES.filter((e) => {
      if (sector && e.sector !== sector) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.sector.toLowerCase().includes(q) ||
        String(e.coefficient).includes(q)
      );
    });
  }, [query, sector]);

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
                مرجع — جدول اینتاکد و ضرایب سود فعالیت
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                جدول <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">اینتاکد</mark> و ضرایب سود فعالیت {INTACODE_YEAR}
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                گزیده‌ای از ضرایب سود فعالیت (اینتاکد) مشاغل رایج برای برآورد
                مالیات تبصره ۱۰۰. عنوان فعالیت را جستجو کنید یا بر اساس بخش فیلتر
                کنید.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <Stat value={faNum(INTACODE_ENTRIES.length)} label="فعالیت در فهرست" />
                <Stat value={faNum(INTACODE_SECTORS.length)} label="بخش فعالیت" />
                <Stat value={INTACODE_YEAR} label="سال" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calc" className="pb-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی عنوان فعالیت، بخش یا ضریب…"
                  className="h-11 pr-9"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSector("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  sector === ""
                    ? "bg-yellow-400 text-slate-900 border-yellow-400"
                    : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300"
                }`}
              >
                همه بخش‌ها
              </button>
              {INTACODE_SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    sector === s
                      ? "bg-yellow-400 text-slate-900 border-yellow-400"
                      : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-slate-500">
              {faNum(filtered.length)} فعالیت یافت شد
            </div>

            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium">عنوان فعالیت</th>
                    <th className="text-right px-4 py-3 font-medium">بخش</th>
                    <th className="text-left px-4 py-3 font-medium">ضریب سود فعالیت</th>
                    <th className="text-left px-4 py-3 font-medium">سال</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e, i) => (
                    <tr key={i} className="hover:bg-yellow-50/40">
                      <td className="px-4 py-3 text-slate-800">{e.title}</td>
                      <td className="px-4 py-3 text-slate-600 text-xs">{e.sector}</td>
                      <td className="px-4 py-3 text-left">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold tabular-nums">
                          {faPercent(e.coefficient / 100, 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-left tabular-nums text-slate-600">{e.year}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-sm">
                        نتیجه‌ای یافت نشد — عبارت دیگری را امتحان کنید.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="text-xs text-slate-600 leading-6 flex items-start gap-1">
                <Info className="h-4 w-4 shrink-0 mt-0.5 text-yellow-600" /> {INTACODE_NOTE}
              </p>
              <a
                href="https://www.tax.gov.ir/action/do/listintacode"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-yellow-700 hover:text-yellow-800"
              >
                <Table2 className="h-3.5 w-3.5" />
                استعلام جدول کامل در سازمان امور مالیاتی کشور
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-yellow-500 tabular-nums">{value}</span>
      <span className="text-xs text-slate-500 leading-5 max-w-[120px]">{label}</span>
    </div>
  );
}
