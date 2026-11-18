"use client";

import { useState } from "react";
import { Search, Phone, ShoppingCart, ChevronDown, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const megaMenu: { label: string; children: string[] }[] = [
  {
    label: "خدمات و آموزش",
    children: ["راوی‌پلاس", "خدمات مالیاتی", "خدمات حسابداری", "خدمات بیمه", "مشاوره", "وکیل", "دادرسی"],
  },
  {
    label: "ابزارها",
    children: ["محاسبه‌گرها", "جداول داده", "صفحات راهنما"],
  },
  {
    label: "قوانین و بخشنامه‌ها",
    children: ["قوانین مالیاتی", "بخشنامه‌ها", "آیین‌نامه‌ها", "آرای هیأت‌ها"],
  },
  {
    label: "آزمون‌ها",
    children: ["مشاوران رسمی", "حسابدار رسمی", "کانون وکلا", "آزمون‌های حسابداری"],
  },
  {
    label: "جداول داده",
    children: ["شناسه کالا و خدمات", "اینتاکد", "آیسیک", "کدینگ حسابداری"],
  },
  {
    label: "وبلاگ",
    children: ["آموزه‌های مالیاتی", "آموزه‌های حسابداری", "آموزه‌های اکسلی", "اخبار"],
  },
];

export function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Top row */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-3 h-[72px]">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <span className="grid place-items-center h-10 w-10 rounded-xl bg-yellow-400 text-slate-900 font-extrabold text-lg shadow-sm">
              م
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-extrabold text-slate-900">مالی‌یار</span>
              <span className="text-[10px] text-slate-500 tracking-wide">MALIYAR</span>
            </span>
          </a>

          {/* Search */}
          <div className="hidden md:flex flex-1 items-center gap-2 max-w-2xl">
            <div className="flex items-stretch w-full rounded-full border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-yellow-400 transition-colors">
              <button className="flex items-center gap-1 px-3 text-sm text-slate-600 border-l border-slate-200">
                همه <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <Input
                placeholder="جستجو در مالی‌یار..."
                className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 h-10"
              />
              <Button
                size="sm"
                className="m-1 rounded-full bg-yellow-400 text-slate-900 hover:bg-yellow-500 px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mr-auto">
            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex rounded-full border-slate-300 text-slate-700 hover:bg-yellow-50 hover:border-yellow-400"
            >
              ورود | ثبت‌نام
            </Button>
            <button
              className="grid place-items-center h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 md:hidden"
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              className="hidden md:grid place-items-center h-10 w-10 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
            <a
              href="tel:02100000000"
              className="hidden sm:flex items-center gap-2 pr-2"
            >
              <span className="grid place-items-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-700">
                <Phone className="h-4 w-4" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-[11px] text-slate-500">مشاوره و پشتیبانی</span>
                <span dir="ltr" className="text-sm font-bold text-slate-900">
                  ۰۲۱-۰۰۰۰۰۰۰۰
                </span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Secondary nav with mega menu */}
      <nav className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <ul className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-none whitespace-nowrap">
            {megaMenu.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    item.label === "ابزارها"
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
                {item.label === "ابزارها" && (
                  <span className="absolute -bottom-[1px] right-3 left-3 h-[3px] bg-yellow-400 rounded-full" />
                )}
                {activeMenu === item.label && (
                  <div className="absolute top-full right-0 mt-0 w-56 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-50">
                    {item.children.map((c) => (
                      <a
                        key={c}
                        href="#"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-slate-900 rounded-lg transition-colors"
                      >
                        {c}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
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
