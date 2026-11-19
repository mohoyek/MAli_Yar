"use client";

import { Phone, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV: { label: string; section?: string }[] = [
  { label: "خانه", section: undefined },
  { label: "خدمات", section: "services" },
  { label: "ابزارها", section: "tools" },
  { label: "قوانین و کدها", section: "laws" },
  { label: "درباره ما", section: "about" },
  { label: "تماس", section: "contact" },
];

export function Header({ onHome }: { onHome: (section?: string) => void }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 h-16">
          <button
            onClick={() => onHome()}
            className="flex items-center gap-2 shrink-0"
            aria-label="مالی‌یار — خانه"
          >
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-yellow-400 text-slate-900 font-extrabold shadow-sm">
              م
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold text-slate-900">مالی‌یار</span>
              <span className="text-[9px] text-slate-500 tracking-wide">
                شرکت حسابداری و مالیاتی
              </span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 mr-4">
            {NAV.map((n) => (
              <button
                key={n.label}
                onClick={() => onHome(n.section)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 mr-auto">
            <a href="tel:02100000000" className="hidden sm:flex items-center gap-2">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-yellow-100 text-yellow-700">
                <Phone className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] text-slate-500">مشاوره رایگان</span>
                <span dir="ltr" className="text-sm font-bold text-slate-900">
                  ۰۲۱-۰۰۰۰۰۰۰۰
                </span>
              </span>
            </a>
            <Button
              onClick={() => onHome("contact")}
              size="sm"
              className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full"
            >
              درخواست مشاوره
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto whitespace-nowrap pb-2 -mt-1 scrollbar-none">
          {NAV.map((n) => (
            <button
              key={n.label}
              onClick={() => onHome(n.section)}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { label: string; onClick?: () => void }[];
}) {
  return (
    <div className="bg-slate-100/70 border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          {items.map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <ChevronLeft className="h-3 w-3 shrink-0" />}
              {item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-slate-700">{item.label}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
