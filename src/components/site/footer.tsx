"use client";

import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle } from "lucide-react";

const footerCols = [
  {
    title: "ابزارهای محاسبه",
    links: [
      "همه ابزارها",
      "محاسبه حقوق و دستمزد",
      "محاسبه مالیات مشاغل",
      "حق بیمه تأمین اجتماعی",
      "جرایم مالیاتی",
      "مالیات سوداگری",
      "مالیات ارث",
    ],
  },
  {
    title: "جدول‌ها و کدها",
    links: [
      "همه جدول‌ها",
      "شناسه کالا و خدمات",
      "اینتاکد",
      "کد آیسیک",
      "ارقام دستمزد سالانه",
      "ارقام سالانه مالیات",
      "دیکشنری مالیاتی",
    ],
  },
  {
    title: "قوانین و بخشنامه‌ها",
    links: [
      "همه قوانین",
      "قانون مالیات‌های مستقیم",
      "قانون ارزش افزوده",
      "قانون سامانه مودیان",
      "قانون سوداگری",
      "بخشنامه‌های مالیاتی",
    ],
  },
  {
    title: "آموزش و آزمون",
    links: [
      "وبلاگ و مقالات",
      "صفحات راهنما",
      "دوره‌های آموزشی",
      "کتاب‌های مالیاتی",
      "آزمون مشاوران رسمی",
      "آزمون حسابدار رسمی",
      "آزمون کانون وکلا",
    ],
  },
  {
    title: "خدمات و پشتیبانی",
    links: [
      "هوش مصنوعی مالی‌یار",
      "اشتراک مالی‌پلاس",
      "خدمات مالیاتی",
      "مشاوره مالیاتی",
      "وکیل مالیاتی",
      "دادرسی مالیاتی",
      "درباره مالی‌یار",
      "پشتیبانی",
    ],
  },
];

export function Footer() {
  const items = [
    { label: "آدرس", value: "تهران – بلوار اصلی، پلاک ۱۲۳ – جهت حضور فقط با هماهنگی قبلی" },
    { label: "ایمیل", value: "info@maliyar.example" },
    { label: "تماس", value: "۰۲۱-۰۰۰۰۰۰۰۰" },
    { label: "ساعات کاری", value: "۸ صبح الی ۱۷:۳۰" },
  ];
  return (
    <footer className="mt-12 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-4 md:p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((it) => (
              <div key={it.label} className="flex flex-col">
                <span className="text-xs text-slate-500">{it.label}</span>
                <span className="text-sm font-bold text-slate-900 mt-1 leading-6">
                  {it.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {footerCols.map((col) => (
            <div key={col.title}>
              <h3 className="text-white font-bold text-sm mb-3">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs text-slate-400 hover:text-yellow-400 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <h3 className="text-white font-bold text-sm mb-3">درباره مالی‌یار</h3>
            <p className="text-xs text-slate-400 leading-7">
              مالی‌یار مرجعی کاربردی در حوزه مالیات و حسابداری برای فارسی‌زبانان
              است؛ مجموعه‌ای که دانش تخصصی را به راهکارهای عملی و قابل استفاده
              تبدیل می‌کند.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center md:text-right">
            تمامی حقوق مادی و معنوی این وبسایت متعلق به مالی‌یار می‌باشد.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <a href="#" className="text-slate-400 hover:text-yellow-400 underline">
              قوانین و مقررات
            </a>
            <a href="#" className="text-slate-400 hover:text-yellow-400 underline">
              تازه‌های سایت
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 left-5 z-50 grid place-items-center h-12 w-12 rounded-full bg-yellow-400 text-slate-900 shadow-lg hover:bg-yellow-500 transition-colors"
          aria-label="بازگشت به بالا"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <button
        className="fixed bottom-5 right-5 z-50 grid place-items-center h-12 w-12 rounded-full bg-yellow-400 text-slate-900 shadow-lg hover:bg-yellow-500 transition-colors"
        aria-label="پشتیبانی"
      >
        <MessageCircle className="h-5 w-5" />
      </button>
    </>
  );
}
