"use client";

import { useState } from "react";
import {
  Receipt,
  BookOpen,
  ShieldCheck,
  Lightbulb,
  Scale,
  Gavel,
  Calculator,
  Wallet,
  CalendarClock,
  FileText,
  Briefcase,
  Barcode,
  CalendarDays,
  Table2,
  Phone,
  Mail,
  MapPin,
  Clock,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export type Tool = "compare" | "salary-tax" | "payroll" | "check-due" | "intacode" | "declaration";

const services = [
  {
    icon: Receipt,
    title: "خدمات مالیاتی",
    desc: "تهیه و ارسال اظهارنامه‌های مالیاتی، پیگیری پرونده‌ها و رسیدگی به اعتراضات مالیاتی شخصی و شرکتی.",
  },
  {
    icon: BookOpen,
    title: "خدمات حسابداری",
    desc: "انجام حسابداری ماهانه، تدوین صورت‌های مالی، حسابداری مالیاتی و سامانه مودیان برای کسب‌وکارها.",
  },
  {
    icon: ShieldCheck,
    title: "خدمات بیمه تأمین اجتماعی",
    desc: "محاسبه و ارسال لیست بیمه، مفاصاحساب ماده ۳۸، رسیدگی به اعتراضات سازمان تأمین اجتماعی.",
  },
  {
    icon: Lightbulb,
    title: "مشاوره مالیاتی",
    desc: "بررسی پرونده مالیاتی، برنامه‌ریزی مالیاتی و کاهش ریسک مالیاتی پیش از رسیدگی.",
  },
  {
    icon: Scale,
    title: "وکیل مالیاتی",
    desc: "اعتراض به تشخیص مالیات، دفاع در کمیسیون‌های مالیاتی و دیوان عدالت اداری با وکیل تخصصی.",
  },
  {
    icon: Gavel,
    title: "دادرس مالیاتی",
    desc: "اعطای اختیار به دادرس مالیاتی برای تعامل رسمی با سازمان امور مالیاتی و انجام اموال پرونده.",
  },
];

const tools: { id: Tool; icon: typeof Calculator; title: string; desc: string }[] = [
  {
    id: "declaration",
    icon: FileText,
    title: "شبیه‌ساز اظهارنامه عملکرد و ارزش افزوده",
    desc: "فرم استاندارد اظهارنامه عملکرد (مالیات بر درآمد) و ارزش افزوده را پر کنید و خروجی استاندارد مالیاتی — درآمد مشمول، پله‌های مالیاتی و مبلغ نهایی — بگیرید.",
  },
  {
    id: "compare",
    icon: Calculator,
    title: "مقایسه مالیات عملکرد و ماده ۱۰۰",
    desc: "فروش، هزینه و شغل را وارد کنید تا مالیات روش اظهارنامه و تبصره ۱۰۰ پله‌به‌پله کنار هم محاسبه شود و ببینید کدام ارزان‌تر است.",
  },
  {
    id: "salary-tax",
    icon: Receipt,
    title: "محاسبه مالیات حقوق",
    desc: "حقوق ماهانه را وارد کنید تا مالیات حقوق طبق پله‌های ماده ۸۴ و بودجه ۱۴۰۵، با معافیت و نرخ مؤثر، محاسبه شود.",
  },
  {
    id: "payroll",
    icon: Wallet,
    title: "محاسبه حقوق و دستمزد",
    desc: "از حقوق ناخالص تا خالص دریاختی: کسر بیمه ۷٪ و ۲۳٪، مالیات حقوق و هزینه کل کارفرما در یک نگاه.",
  },
  {
    id: "check-due",
    icon: CalendarClock,
    title: "راس‌گیری چک",
    desc: "مبلغ و سررسید شمسی چک‌ها را وارد کنید تا تاریخ میانگین موزون (راس) و مجموع چک‌ها به‌صورت زنده محاسبه شود.",
  },
];

type LawGroup = {
  icon: typeof FileText;
  title: string;
  items: string[];
  href?: string;
  linkLabel: string;
  internalTool?: Tool;
};

const lawGroups: LawGroup[] = [
  {
    icon: FileText,
    title: "قوانین مالیاتی",
    items: ["قانون مالیات‌های مستقیم", "قانون مالیات بر ارزش افزوده", "قانون سامانه مودیان", "بخشنامه‌های مالیاتی"],
    href: "https://www.tax.gov.ir",
    linkLabel: "سازمان امور مالیاتی",
  },
  {
    icon: Briefcase,
    title: "قوانین کار و بیمه",
    items: ["قانون کار", "قانون تأمین اجتماعی", "قانون بیمه بیکاری", "بخشنامه‌های دستمزد"],
    href: "https://www.mcla.gov.ir",
    linkLabel: "وزارت تعاون، کار و رفاه",
  },
  {
    icon: Barcode,
    title: "کدها و شناسه‌ها",
    items: ["شناسه کالا و خدمات", "جدول ارتکاز (ضریب مالیاتی)", "اینتاکد", "کدینگ حسابداری"],
    href: "https://www.intamedia.ir",
    linkLabel: "پایگاه اینتاکد",
  },
  {
    icon: CalendarDays,
    title: "ارقام و مصوبات سالانه",
    items: ["مصوبات دستمزد سالانه", "ارقام سالانه مالیات", "ارزش اجرای املاک", "ضریب حق بیمه"],
    href: "https://www.mporg.ir",
    linkLabel: "مرکز پژوهش‌های مجلس",
  },
  {
    icon: Table2,
    title: "جدول اینتاکد و ضرایب سود فعالیت",
    items: ["ضرایب سود فعالیت ۱۴۰۵", "جستجوی عنوان فعالیت", "بخش‌بندی مشاغل"],
    internalTool: "intacode",
    linkLabel: "مشاهده جدول",
  },
];

const aboutStats = [
  { value: "+۱۵", label: "سال تجربه تخصصی" },
  { value: "+۱۲۰۰", label: "پرونده فعال" },
  { value: "٪۹۸", label: "رضایت موکلان" },
];

const contactInfo = [
  { icon: Phone, label: "تلفن", value: "۰۲۱-۰۰۰۰۰۰۰۰", dir: "ltr" },
  { icon: Mail, label: "ایمیل", value: "info@maliyar.example", dir: "ltr" },
  { icon: MapPin, label: "آدرس", value: "تهران – بلوار اصلی، پلاک ۱۲۳", dir: "rtl" },
  { icon: Clock, label: "ساعات کاری", value: "شنبه تا چهارشنبه، ۸ تا ۱۷:۳۰", dir: "rtl" },
];

const faqItems = [
  {
    q: "برای دریافت مشاوره از کجا شروع کنم؟",
    a: "از فرم تماس همین صفحه یا شماره تلفن شرکت استفاده کنید؛ کارشناسان ما پس از بررسی اولیه، جلسه مشاوره (حضوری یا آنلاین) هماهنگ می‌کنند.",
  },
  {
    q: "خدمات مالی‌یار برای چه کسب‌وکارهایی مناسب است؟",
    a: "خدمات ما برای اشخاص حقیقی و حقوقی، مشاغل اصناف، شرکت‌های خدماتی و تولیدی و کسب‌وکارهای آنلاین طراحی شده است؛ از حسابداری ماهانه تا دفاع در کمیسیون مالیاتی.",
  },
  {
    q: "ابزارهای محاسبه رایگان هستند؟",
    a: "بله؛ چهار ابزار محاسبه‌گر این سایت (مقایسه مالیات عملکرد و ماده ۱۰۰، مالیات حقوق، حقوق و دستمزد و راس‌گیری چک) رایگان و بدون نیاز به ثبت‌نام در دسترس هستند.",
  },
  {
    q: "ارقام و نرخ‌های محاسبه‌گرها تا چه حد دقیق هستند؟",
    a: "نرخ‌ها بر اساس قانون بودجه ۱۴۰۵ و بخشنامه‌های جاری تنظیم شده‌اند. با این حال نتیجه یک برآورد آموزشی است و برای پرونده واقعی باید با کارشناس پرونده بررسی شود.",
  },
];

export function HomeView({ onOpenTool }: { onOpenTool: (t: Tool) => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", service: "", message: "" });

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: "نام و تلفن الزامی است", description: "لطفاً این دو فیلد را تکمیل کنید." });
      return;
    }
    toast({
      title: "درخواست شما ثبت شد",
      description: "کارشناسان ما به‌زودی با شما تماس می‌گیرند.",
    });
    setForm({ name: "", phone: "", service: "", message: "" });
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-12 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative max-w-3xl">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1" />
                شرکت حسابداری و مالیاتی مالی‌یار
              </Badge>
              <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.2]">
                حسابداری و مالیاتِ کسب‌وکار شما،{" "}
                <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">ساده و دقیق</mark>
              </h1>
              <p className="mt-5 text-slate-600 text-sm md:text-lg leading-8">
                از حسابداری ماهانه و اظهارنامه مالیاتی تا دفاع در کمیسیون‌های رسیدگی؛
                تیم مالی‌یار کنار کسب‌وکار شماست. ابزارهای رایگان زیر هم کمک می‌کنند
                قبل از مراجعه، ارقام را خودتان برآورد کنید.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  onClick={() => document.getElementById("tools")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
                >
                  ابزارهای رایگان <ChevronLeft className="h-4 w-4 mr-1" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="rounded-full px-6"
                >
                  دریافت مشاوره
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6">
                {aboutStats.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-yellow-500 tabular-nums">{s.value}</span>
                    <span className="text-xs text-slate-500 leading-5 max-w-[120px]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services" title="خدمات ما" subtitle="مجموعه کاملی از خدمات حسابداری، مالیاتی و بیمه برای کسب‌وکار شما">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.title} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-yellow-300 hover:shadow-md transition-all">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-yellow-100 text-yellow-700">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-7">{s.desc}</p>
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-4 text-sm font-medium text-yellow-700 hover:text-yellow-800 inline-flex items-center gap-1"
              >
                درخواست این خدمت <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools */}
      <Section id="tools" title="ابزارهای رایگان محاسبه" subtitle="ارقام را خودتان برآورد کنید؛ نرخ‌ها بر اساس بودجه ۱۴۰۵">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t) => (
            <div key={t.id} className="flex flex-col bg-white rounded-2xl border border-slate-200 p-6 hover:border-yellow-300 hover:shadow-md transition-all">
              <div className="grid place-items-center h-12 w-12 rounded-xl bg-yellow-400 text-slate-900">
                <t.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-bold text-slate-900 text-sm leading-6">{t.title}</h3>
              <p className="mt-2 text-xs text-slate-600 leading-6 flex-1">{t.desc}</p>
              <Button
                onClick={() => onOpenTool(t.id)}
                className="mt-4 bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full"
                size="sm"
              >
                شروع محاسبه <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
          ))}
        </div>
      </Section>

      {/* Laws & Codes */}
      <Section id="laws" title="قوانین، کدها و ارقام" subtitle="دسترسی سریع به منابع رسمی حوزه مالیات، کار و بیمه">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {lawGroups.map((g) => (
            <div key={g.title} className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="grid place-items-center h-10 w-10 rounded-lg bg-slate-900 text-yellow-400">
                <g.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-bold text-slate-900 text-sm">{g.title}</h3>
              <ul className="mt-3 space-y-1.5">
                {g.items.map((it) => (
                  <li key={it} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-yellow-400 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
              {g.internalTool ? (
                <button
                  onClick={() => onOpenTool(g.internalTool)}
                  className="mt-4 text-xs font-medium text-yellow-700 hover:text-yellow-800 inline-flex items-center gap-1"
                >
                  {g.linkLabel} <ArrowLeft className="h-3 w-3" />
                </button>
              ) : (
                <a
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-medium text-yellow-700 hover:text-yellow-800 inline-flex items-center gap-1"
                >
                  {g.linkLabel} <ArrowLeft className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* About */}
      <Section id="about" title="درباره مالی‌یار" subtitle="">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10">
          <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 items-center">
            <div>
              <p className="text-slate-600 text-sm md:text-base leading-8">
                مالی‌یار یک شرکت حسابداری و مالیاتی است که از سال‌ها پیش، خدماتی
                شامل حسابداری ماهانه، اظهارنامه عملکرد، مالیات بر ارزش افزوده،
                مفاصاحساب بیمه و دفاع در کمیسیون‌های مالیاتی ارائه می‌کند. رویکرد
                ما ترکیب دانش تخصصی با ابزارهای کاربردی است تا کسب‌وکارها هم
                درست تصمیم بگیرند و هم پرونده‌شان را بدون دغدغه پیش ببرند.
              </p>
              <p className="mt-4 text-slate-600 text-sm md:text-base leading-8">
                ابزارهای رایگان این سایت هم گامی در همین مسیر است: هر مودی بتواند
                قبل از مراجعه به کارشناس، ارقام مالیات و حقوق خود را برآورد کند و
                با دیدی روشن‌تر مشاوره بگیرد.
              </p>
              <Button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-6 bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6"
              >
                دریافت مشاوره رایگان <ChevronLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {aboutStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center">
                  <div className="text-2xl font-extrabold text-yellow-500 tabular-nums">{s.value}</div>
                  <div className="mt-1 text-[11px] text-slate-500 leading-5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" title="تماس و مشاوره" subtitle="فرم را پر کنید یا مستقیم تماس بگیرید">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="space-y-4">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="grid place-items-center h-10 w-10 rounded-full bg-yellow-100 text-yellow-700 shrink-0">
                    <c.icon className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">{c.label}</span>
                    <span dir={c.dir} className="text-sm font-bold text-slate-900">{c.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-xs text-yellow-800 leading-6">
              <Sparkles className="h-4 w-4 inline-block ml-1" />
              مشاوره اولیه رایگان است؛ پس از بررسی، هزینه خدمات به‌صورت شفاف اعلام می‌شود.
            </div>
          </div>

          <form onSubmit={submitForm} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">نام و نام خانوادگی</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="نام شما" className="h-11" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">تلفن تماس</label>
                <Input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="۰۹۱۲…" className="h-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع خدمت</label>
              <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                <SelectTrigger className="h-11"><SelectValue placeholder="انتخاب خدمت" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax">خدمات مالیاتی</SelectItem>
                  <SelectItem value="accounting">خدمات حسابداری</SelectItem>
                  <SelectItem value="insurance">خدمات بیمه</SelectItem>
                  <SelectItem value="advisory">مشاوره مالیاتی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">توضیح کوتاه</label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="نوع کسب‌وکار و درخواست خود را کوتاه بنویسید…"
                rows={3}
              />
            </div>
            <Button type="submit" className="bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-6">
              ارسال درخواست مشاوره
            </Button>
          </form>
        </div>
      </Section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 lg:px-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-5 flex items-center gap-2">
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

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="py-10 md:py-14 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}
