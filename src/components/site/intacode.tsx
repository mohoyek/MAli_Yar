"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  HelpCircle,
  Info,
  Search,
  ExternalLink,
  Table2,
  ChevronLeft,
  ChevronRight,
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
import { faNum, faNumDec, toLatinDigits } from "@/lib/format";
import {
  INTACODE_ENTRIES,
  INTACODE_SECTORS,
  INTACODE_YEARS,
  INTACODE_COUNT,
  INTACODE_YEAR_COUNTS,
} from "@/data/intacode";

const ENTRIES_PER_PAGE = 50;

const INTACODE_NOTE =
  "این جدول شامل داده‌های کامل ضریب سود فعالیت (اینتاکد) است که از دفترچه رسمی سازمان امور مالیاتی کشور برای سال‌های عملکرد ۱۴۰۲، ۱۴۰۳ و ۱۴۰۴ استخراج شده است. هر کد فعالیت شامل هر دو نسبت «سود فعالیت» و «سود ناویژه» در بخش‌های تولید، بازرگانی و خدمات است. با انتخابگر سال می‌توانید ضرایب هر سال را جداگانه بررسی و مقایسه کنید.";

const faqItems = [
  {
    q: "اینتاکد چیست؟",
    a: "اینتاکد (کد طبقه‌بندی فعالیت اقتصادی) شناسه‌ای است که سازمان امور مالیاتی به هر فعالیت اقتصادی اختصاص می‌دهد و همراه با «ضریب سود فعالیت» برای محاسبه مالیات مقطوع تبصره ۱۰۰ به‌کار می‌رود.",
  },
  {
    q: "نسبت سود فعالیت چیست؟",
    a: "نسبت سود فعالیت درصد پیش‌فرض سود به فروش است که سازمان مالیات برای هر فعالیت تعیین می‌کند. در روش تبصره ۱۰۰، درآمد مشمول برابر است با فروش ضربدر نسبت سود فعالیت.",
  },
  {
    q: "نسبت سود ناویژه چیست؟",
    a: "نسبت سود ناویژه نسبت سود به فروش قبل از کسر هزینه‌های مالیاتی است و معمولاً بالاتر از نسبت سود فعالیت است. این نسبت برای محاسبات داخلی و مقایسه استفاده می‌شود.",
  },
  {
    q: "این داده‌ها از کجا آمده‌اند؟",
    a: "داده‌ها از دفترچه رسمی ضرایب سود فعالیت سازمان امور مالیاتی کشور برای سال‌های عملکرد ۱۴۰۲، ۱۴۰۳ و ۱۴۰۴ استخراج شده‌اند. ضریب دقیق هر فعالیت را می‌توانید از سایت سازمان امور مالیاتی نیز استعلام کنید.",
  },
];

export function IntacodeView({ onGoHome }: { onGoHome: () => void }) {
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("");
  const [year, setYear] = useState<string>(INTACODE_YEARS[0]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = toLatinDigits(query).trim().toLowerCase();
    return INTACODE_ENTRIES.filter((e) => {
      if (e.year !== year) return false;
      if (sector && e.sector !== sector) return false;
      if (!q) return true;
      return (
        e.title.toLowerCase().includes(q) ||
        e.sector.toLowerCase().includes(q) ||
        e.code.includes(q) ||
        String(e.coefficient ?? "").includes(q) ||
        String(e.grossCoefficient ?? "").includes(q)
      );
    });
  }, [query, sector, year]);

  const totalPages = Math.ceil(filtered.length / ENTRIES_PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const start = (currentPage - 1) * ENTRIES_PER_PAGE;
  const pageEntries = filtered.slice(start, start + ENTRIES_PER_PAGE);

  // Reset page when filters change
  function onSearchChange(v: string) {
    setQuery(v);
    setPage(1);
  }
  function onSectorChange(s: string) {
    setSector(s);
    setPage(1);
  }
  function onYearChange(y: string) {
    setYear(y);
    setPage(1);
  }

  const yearCount = INTACODE_YEAR_COUNTS[year] ?? 0;

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of INTACODE_ENTRIES) {
      if (e.year !== year) continue;
      counts[e.sector] = (counts[e.sector] ?? 0) + 1;
    }
    return counts;
  }, [year]);

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
                مرجع کامل — جدول اینتاکد و ضرایب سود فعالیت (۱۴۰۲-۱۴۰۴)
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                جدول کامل <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">اینتاکد</mark> و ضرایب سود فعالیت (۱۴۰۲-۱۴۰۴)
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                داده‌های کامل ضریب سود فعالیت (اینتاکد) برای سال‌های عملکرد ۱۴۰۲ تا ۱۴۰۴ —
                شامل {faNum(INTACODE_COUNT)} کد فعالیت در ۳ بخش تولید، بازرگانی و خدمات.
                با انتخابگر سال و فیلتر بخش، کد فعالیت، نسبت سود فعالیت و سود ناویژه را جستجو کنید.
              </p>
              <div className="mt-6 flex flex-wrap gap-6">
                <Stat value={faNum(INTACODE_COUNT)} label="کد فعالیت (۳ سال)" />
                <Stat value={faNum(INTACODE_SECTORS.length)} label="بخش فعالیت" />
                <Stat value={faNum(INTACODE_YEARS.length)} label="سال عملکرد" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calc" className="pb-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            {/* Search */}
            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={query}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="جستجوی کد، عنوان فعالیت، بخش یا ضریب…"
                  className="h-11 pr-9"
                />
              </div>
            </div>

            {/* Year selector */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 ml-1">سال عملکرد:</span>
              {INTACODE_YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => onYearChange(y)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    year === y
                      ? "bg-slate-900 text-yellow-400 border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {y} ({faNum(INTACODE_YEAR_COUNTS[y] ?? 0)})
                </button>
              ))}
            </div>

            {/* Sector filter */}
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onSectorChange("")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  sector === ""
                    ? "bg-yellow-400 text-slate-900 border-yellow-400"
                    : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300"
                }`}
              >
                همه بخش‌ها ({faNum(yearCount)})
              </button>
              {INTACODE_SECTORS.map((s) => (
                <button
                  key={s}
                  onClick={() => onSectorChange(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    sector === s
                      ? "bg-yellow-400 text-slate-900 border-yellow-400"
                      : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300"
                  }`}
                >
                  {s} ({faNum(sectorCounts[s] ?? 0)})
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>
                {faNum(filtered.length)} فعالیت — صفحه {faNum(currentPage)} از {faNum(totalPages || 1)}
              </span>
              {filtered.length > ENTRIES_PER_PAGE && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="grid place-items-center h-8 w-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <span className="tabular-nums">{faNum(currentPage)} / {faNum(totalPages)}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="grid place-items-center h-8 w-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Table */}
            <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs">
                  <tr>
                    <th className="text-right px-3 py-3 font-medium whitespace-nowrap">کد یونیک</th>
                    <th className="text-right px-3 py-3 font-medium">شرح فعالیت</th>
                    <th className="text-right px-3 py-3 font-medium whitespace-nowrap">بخش</th>
                    <th className="text-left px-3 py-3 font-medium whitespace-nowrap">سود فعالیت (٪)</th>
                    <th className="text-left px-3 py-3 font-medium whitespace-nowrap">سود ناویژه (٪)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageEntries.map((e) => (
                    <tr key={e.code} className="hover:bg-yellow-50/40">
                      <td className="px-3 py-2.5 text-slate-500 tabular-nums text-xs whitespace-nowrap" dir="ltr">{e.code}</td>
                      <td className="px-3 py-2.5 text-slate-800 text-xs leading-5">{e.title}</td>
                      <td className="px-3 py-2.5 text-slate-600 text-xs whitespace-nowrap">{e.sector}</td>
                      <td className="px-3 py-2.5 text-left">
                        {e.coefficient != null ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold tabular-nums">
                            {faNumDec(e.coefficient, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-left">
                        {e.grossCoefficient != null ? (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium tabular-nums">
                            {faNumDec(e.grossCoefficient, 2)}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {pageEntries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">
                        نتیجه‌ای یافت نشد — عبارت دیگری را امتحان کنید.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {filtered.length > ENTRIES_PER_PAGE && (
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>
                  نمایش {faNum(start + 1)} تا {faNum(Math.min(start + ENTRIES_PER_PAGE, filtered.length))} از {faNum(filtered.length)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    قبلی
                  </button>
                  <span className="tabular-nums">{faNum(currentPage)} / {faNum(totalPages)}</span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}

            {/* Note */}
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

      {/* FAQ */}
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl font-extrabold text-yellow-500 tabular-nums">{value}</span>
      <span className="text-xs text-slate-500 leading-5 max-w-[120px]">{label}</span>
    </div>
  );
}
