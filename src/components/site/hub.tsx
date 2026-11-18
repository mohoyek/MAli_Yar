"use client";

import { useState } from "react";
import {
  Calculator,
  Wallet,
  Building2,
  ScrollText,
  TrendingUp,
  Car,
  Home,
  Coins,
  Receipt,
  FileCheck,
  PiggyBank,
  Sparkles,
  ArrowLeft,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type FormItem = {
  title: string;
  desc: string;
  icon: React.ReactNode;
  action?: () => void;
};

type Category = {
  id: string;
  title: string;
  count: number;
  items: FormItem[];
};

const ICON_CLASS = "h-5 w-5";

function makeCategories(openCompare: () => void): Category[] {
  return [
    {
      id: "salary",
      title: "حقوق و دستمزد",
      count: 6,
      items: [
        {
          title: "محاسبه مالیات حقوق",
          desc: "مالیات حقوق ماهانه سال ۱۴۰۴ را با جدول پلکانی قانون بودجه، پله به پله و رایگان حساب کنید.",
          icon: <Calculator className={ICON_CLASS} />,
        },
        {
          title: "محاسبه حقوق پیشرفته",
          desc: "همه ردیف‌های یک فیش واقعی در یک جا: حقوق پایه و مزایای مصوب، اضافه‌کاری، شب‌کاری، نوبت‌کاری، تعطیل‌کاری، مأموریت، مزایای رفاهی، مساعده و کسورات قراردادی.",
          icon: <Wallet className={ICON_CLASS} />,
        },
        {
          title: "حقوق دستمزد (وزارت کار)",
          desc: "روز یا ساعت کارکرد، وضعیت تأهل و تعداد فرزند را وارد کنید تا حقوق پایه، بن خواربار، حق مسکن، حق اولاد، پایه سنوات، سهم بیمه، مالیات و خالص پرداختی طبق مصوبه همان سال محاسبه شود.",
          icon: <FileCheck className={ICON_CLASS} />,
        },
        {
          title: "محاسبه معکوس حقوق ۱۴۰۴",
          desc: "رقم خالصی که قرار است به حساب کارمند برود را وارد کنید؛ ابزار به عقب برمی‌گردد و می‌گوید حقوق پایه و ناخالص باید چقدر باشد تا بعد از کسر بیمه ۷ درصد و مالیات پلکانی همان سال، دقیقاً همان خالص دربیاید.",
          icon: <Calculator className={ICON_CLASS} />,
        },
        {
          title: "محاسبه عیدی و سنوات",
          desc: "مزد روزانه و بازه کارکرد را وارد کنید تا عیدی (۶۰ روز مزد با سقف ۹۰ روز حداقل مزد)، سنوات خدمت و بازخرید مرخصی به‌نسبت کارکرد حساب شود.",
          icon: <PiggyBank className={ICON_CLASS} />,
        },
        {
          title: "تبدیل حقوق ۱۴۰۳ به ۱۴۰۴",
          desc: "هر سال بخشنامه مزد برای کارگرانی که بالاتر از حداقل می‌گیرند، یک فرمول می‌دهد: درصد افزایش به‌اضافه یک مبلغ ثابت روزانه. حقوق سال قبل را وارد کنید تا حقوق سال جدید با همان فرمول حساب شود.",
          icon: <TrendingUp className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "insurance",
      title: "بیمه",
      count: 5,
      items: [
        {
          title: "حق بیمه قرارداد پیمانکاری (ماده ۳۸)",
          desc: "حق بیمه قرارداد پیمانکاری را با ضریب قانونی خودش حساب کنید: عمرانی یا غیرعمرانی، با مصالح یا دستمزدی، همراه بیمه بیکاری و مانده بدهی تا صدور مفاصاحساب ماده ۳۸.",
          icon: <FileCheck className={ICON_CLASS} />,
        },
        {
          title: "حق بیمه تأمین اجتماعی",
          desc: "با این ابزار سهم بیمه‌شده، سهم کارفرما و بیمه بیکاری را جداگانه و بر اساس حقوق مشمول بیمه محاسبه کنید.",
          icon: <Wallet className={ICON_CLASS} />,
        },
        {
          title: "حق بیمه پروانه ساختمانی",
          desc: "حق بیمهٔ سهم مالک هنگام صدور پروانهٔ ساختمانی را بر پایهٔ مجموع عوارض شهرداری و نرخ مصوب حساب کنید.",
          icon: <Building2 className={ICON_CLASS} />,
        },
        {
          title: "حقوق بازنشستگی تأمین اجتماعی",
          desc: "حقوق بازنشستگی تقریبی خود را از روی میانگین دستمزد دو سال آخر و سنوات پرداخت حق بیمه برآورد کنید.",
          icon: <PiggyBank className={ICON_CLASS} />,
        },
        {
          title: "مقرری بیمه بیکاری",
          desc: "مبلغ ماهانه و مدت دریافت مقرری بیمه بیکاری را بر اساس متوسط دستمزد، سابقه و وضعیت تأهل برآورد کنید.",
          icon: <Receipt className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "business",
      title: "مالیات کسب‌وکار",
      count: 6,
      items: [
        {
          title: "مقایسه اظهارنامه و تبصره ۱۰۰",
          desc: "فروش، هزینه و عنوان شغل را وارد کنید تا مالیات روش اظهارنامه و روش تبصره ۱۰۰ کنار هم و پله‌به‌پله محاسبه شود و ببینید کدام روش برای شما کم‌هزینه‌تر است.",
          icon: <Calculator className={ICON_CLASS} />,
          action: openCompare,
        },
        {
          title: "مالیات گردش حساب بانکی",
          desc: "کل واریزی‌های سال، نوع شخص، وضعیت اظهارنامه و عنوان شغل را وارد کنید و واریزی‌های غیردرآمدی را جدا کنید؛ ابزار خالص واریزی قابل رسیدگی را با ضریب اینتاکد به درآمد مشمول تبدیل می‌کند.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
        {
          title: "محاسبه مالیات تبصره ۱۰۰",
          desc: "فروش سالانه، سال عملکرد، تعداد شرکا و عنوان شغل را وارد کنید؛ ابزار ضریب سود فعالیت را از جدول برمی‌دارد، معافیت ماده ۱۰۱ همان سال را کم می‌کند و مالیات مقطوع را با پله‌های ماده ۱۳۱ نشان می‌دهد.",
          icon: <Receipt className={ICON_CLASS} />,
        },
        {
          title: "محاسبه مالیات شرکت‌ها",
          desc: "فروش دوره، هزینه‌های قابل قبول، زیان تأییدشده، هزینه‌های غیرقابل قبول، درآمدهای معاف و نرخ صفر، مالیات علی‌الحساب و وضعیت اظهارنامه را وارد کنید تا درآمد مشمول، مالیات ۲۵ درصدی ماده ۱۰۵، تخفیف‌ها، جرایم و نرخ مؤثر مالیات شرکت سطر به سطر محاسبه شود.",
          icon: <Building2 className={ICON_CLASS} />,
        },
        {
          title: "مالیات مشاغل",
          desc: "فروش دوره، هزینه‌ها و استهلاک، سال عملکرد و تعداد شرکا را وارد کنید تا سود خالص، معافیت سالانه ماده ۱۰۱، سایر معافیت‌ها، تخفیف افزایش درآمد و مالیات پلکانی ماده ۱۳۱ سطر به سطر محاسبه شود.",
          icon: <Wallet className={ICON_CLASS} />,
        },
        {
          title: "محاسبه مالیات چک",
          desc: "نوع شخص، سال عملکرد، ماهیت چک، وضعیت چک و مبلغ چک‌های دریافتی را وارد کنید؛ ابزار می‌گوید چک مشمول رسیدگی است یا نه و مالیات احتمالی را با ضریب سود فعالیت و نرخ همان شخص برآورد می‌کند.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "fines",
      title: "جرایم مالیاتی",
      count: 3,
      items: [
        {
          title: "جریمه ارزش افزوده",
          desc: "جریمه‌های ارزش افزوده شامل دیرکرد پرداخت، عدم تسلیم اظهارنامه و کتمان را طبق قانون دائمی ۱۴۰۰ حساب کنید.",
          icon: <Receipt className={ICON_CLASS} />,
        },
        {
          title: "بخشودگی جرایم مالیاتی",
          desc: "محاسبه بخشودگی جرایم مالیاتی بر اساس سال عملکرد، مراحل دادرسی، ماه‌های تأخیر و درصد اضافه بخشنامه‌های جاری؛ درصد، مبلغ بخشوده و مبلغ قابل پرداخت را همین‌جا ببینید.",
          icon: <FileCheck className={ICON_CLASS} />,
        },
        {
          title: "جریمه اظهارنامه و پرداخت مالیات",
          desc: "جریمه دیرکرد یا عدم تسلیم اظهارنامه و تأخیر در پرداخت مالیات را طبق قانون مالیات‌های مستقیم حساب کنید.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "speculation",
      title: "مالیات سوداگری",
      count: 5,
      items: [
        {
          title: "سوداگری - خودرو",
          desc: "تاریخ خرید و فروش و مبلغ معامله خودرو را وارد کنید تا این ابزار وضعیت معافیت شما را تعیین کند و در صورت مشمول بودن، عایدی مشمول مالیات، تعدیل تورمی و مالیات نهایی را محاسبه کند.",
          icon: <Car className={ICON_CLASS} />,
        },
        {
          title: "مالیات سوداگری - ملک",
          desc: "تاریخ خرید و فروش، مبلغ معامله و نوع ملک را وارد کنید تا این ابزار وضعیت معافیت شما را تعیین کند و در صورت مشمول بودن، عایدی مشمول مالیات، تعدیل تورمی و مالیات نهایی را محاسبه کند.",
          icon: <Home className={ICON_CLASS} />,
        },
        {
          title: "سوداگری - رمز ارز",
          desc: "مبلغ و تاریخ خرید و فروش رمزارز و اینکه به چه کسی می‌فروشید را وارد کنید تا این ابزار سقف معافیت پنج‌ساله ماده ۸۴، تعدیل تورمی و مالیات نهایی سود رمزارز را بر اساس قانون سوداگری محاسبه کند.",
          icon: <Coins className={ICON_CLASS} />,
        },
        {
          title: "سوداگری - ارز",
          desc: "مبلغ و تاریخ خرید و فروش ارز، منشأ ارز و اینکه به چه کسی می‌فروشید را وارد کنید تا این ابزار معافیت‌ها، سقف پنج‌ساله ماده ۸۴، تعدیل تورمی و مالیات نهایی سود ارز را محاسبه کند.",
          icon: <Coins className={ICON_CLASS} />,
        },
        {
          title: "سوداگری - طلا",
          desc: "مبلغ و تاریخ خرید و فروش طلا و اینکه به چه کسی می‌فروشید را وارد کنید تا این ابزار سقف معافیت پنج‌ساله ماده ۸۴، تعدیل تورمی و مالیات نهایی سود طلا را محاسبه کند.",
          icon: <Coins className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "transfer",
      title: "مالیات نقل و انتقال",
      count: 2,
      items: [
        {
          title: "مالیات نقل و انتقال خودرو",
          desc: "مالیات نقل و انتقال خودرو (۱٪ با کاهش بر اساس عمر خودرو) را محاسبه کنید.",
          icon: <Car className={ICON_CLASS} />,
        },
        {
          title: "مالیات نقل و انتقال ملک",
          desc: "مالیات نقل و انتقال قطعی ملک (۵٪ ارزش معاملاتی) و مالیات سرقفلی (۲٪) را طبق ماده ۵۹ حساب کنید.",
          icon: <Home className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "realestate",
      title: "املاک و مستغلات",
      count: 3,
      items: [
        {
          title: "مالیات خانه‌های خالی",
          desc: "مالیات خانه خالی را طبق ماده ۵۴ مکرر با ضریب سال و تعداد ماه‌های خالی محاسبه کنید.",
          icon: <Home className={ICON_CLASS} />,
        },
        {
          title: "مالیات درآمد اجاره",
          desc: "مالیات درآمد اجاره ملک را طبق ماده ۵۳ (کسر ۲۵٪) و نرخ پلکانی ماده ۱۳۱ برای مالک حساب کنید.",
          icon: <Receipt className={ICON_CLASS} />,
        },
        {
          title: "تبدیل رهن و اجاره",
          desc: "رهن را به اجاره و اجاره را به رهن با نرخ تبدیل دلخواه تبدیل کنید و معادل کامل قرارداد را ببینید.",
          icon: <Wallet className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "gold",
      title: "طلا و سکه",
      count: 3,
      items: [
        {
          title: "مالیات طلافروشان",
          desc: "سال، نوع فعالیت، فروش، اجرت و سود را وارد کنید تا مالیات عملکرد با ضریب اینتاکد و نرخ ماده ۱۳۱، و مالیات ارزش افزوده اجرت و سود محاسبه شود.",
          icon: <Coins className={ICON_CLASS} />,
        },
        {
          title: "مالیات سکه",
          desc: "سال دریافت و تعداد سکه را وارد کنید تا سکه‌های معاف و مالیات مقطوع طبق دستورالعمل همان سال محاسبه شود.",
          icon: <Coins className={ICON_CLASS} />,
        },
        {
          title: "مالیات طلا برای خریدار",
          desc: "وزن، قیمت هر گرم، اجرت و سود طلافروش را وارد کنید تا مالیات ارزش افزوده و مبلغ نهایی فاکتور محاسبه شود. مالیات فقط به اجرت و سود تعلق می‌گیرد، نه به خود طلا.",
          icon: <Receipt className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "misc",
      title: "ملک، ارث و چک",
      count: 3,
      items: [
        {
          title: "راس‌گیری چک",
          desc: "راس‌گیری چک یعنی پیدا کردن یک تاریخ میانگین برای چند چک با مبلغ و سررسید متفاوت. کافیست چک‌ها را با مبلغ و تاریخ سررسیدشان وارد کنید تا تاریخ راس، جمع مبالغ و در صورت نیاز مبلغ تنزیل را ببینید.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
        {
          title: "مالیات تکلیفی اجاره",
          desc: "محاسبه مالیات تکلیفی اجاره برای مستأجر حقوقی: نوع محاسبه، نوع موجر و اجاره ماهانه را وارد کنید تا مالیاتی که باید کسر و پرداخت کنید و مبلغ قابل پرداخت به موجر، پس از کسر ۲۵ درصد هزینه‌ها، محاسبه شود.",
          icon: <Receipt className={ICON_CLASS} />,
        },
        {
          title: "محاسبه آنلاین مالیات ارث",
          desc: "طبقه وراث، سهم وارث و ارزش هر نوع دارایی را وارد کنید تا مالیات کل ماترک و سهم شما با نرخ‌های ماده ۱۷، پس از کسر بدهی‌ها و معافیت‌ها، محاسبه شود.",
          icon: <FileCheck className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "analysis",
      title: "تحلیل مالی و حسابداری",
      count: 4,
      items: [
        {
          title: "تسعیر ارز",
          desc: "سود یا زیان تسعیر اقلام پولی ارزی را از تفاوت نرخ تاریخ معامله و تاریخ ترازنامه، طبق دستورالعمل جدید، حساب کنید.",
          icon: <TrendingUp className={ICON_CLASS} />,
        },
        {
          title: "ارزش فعلی و نرخ بازده (NPV و IRR)",
          desc: "ارزش فعلی خالص (NPV) و نرخ بازده داخلی (IRR) یک سرمایه‌گذاری چندساله را حساب کنید.",
          icon: <Calculator className={ICON_CLASS} />,
        },
        {
          title: "نقطه سربه‌سر و بهای تمام‌شده",
          desc: "نقطه سربه‌سر (تعداد و مبلغ فروش) و بهای تمام‌شده هر واحد را محاسبه کنید.",
          icon: <PiggyBank className={ICON_CLASS} />,
        },
        {
          title: "نسبت‌های مالی از صورت مالی",
          desc: "نسبت‌های نقدینگی، اهرمی و سودآوری را از روی اعداد صورت مالی محاسبه و تحلیل کنید.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "exams",
      title: "آزمون‌ها",
      count: 1,
      items: [
        {
          title: "چند سؤال درست کافی است؟",
          desc: "ببین برای قبولی در آزمون‌های حرفه‌ای مالی، با احتساب نمره منفی، دست‌کم چند سؤال باید درست بزنی.",
          icon: <FileCheck className={ICON_CLASS} />,
        },
      ],
    },
    {
      id: "tax",
      title: "مالیات",
      count: 2,
      items: [
        {
          title: "محاسبه مهلت‌های دادرسی مالیاتی",
          desc: "سندی که به شما ابلاغ شده (برگ تشخیص یا رأی هیأت) و تاریخ ابلاغ را انتخاب کنید تا آخرین مهلت قانونی اعتراض و مرجع بعدی را به تاریخ شمسی ببینید.",
          icon: <ScrollText className={ICON_CLASS} />,
        },
        {
          title: "محاسبه حق تمبر وکالت (ماده ۱۰۳ ق.م.م)",
          desc: "نوع پرونده و رقم حق‌الوکاله یا مبلغ مابه‌الاختلاف را وارد کنید تا حق تمبر ۵٪ وکالتنامه موضوع ماده ۱۰۳ قانون مالیات‌های مستقیم برای هر مرحله محاسبه شود.",
          icon: <Receipt className={ICON_CLASS} />,
        },
      ],
    },
  ];
}

const popularForms = [
  {
    title: "محاسبه مالیات حقوق",
    desc: "پله‌به‌پله طبق قانون بودجه",
    icon: <Calculator className="h-6 w-6" />,
  },
  {
    title: "محاسبه حقوق پیشرفته",
    desc: "همه ردیف‌های فیش حقوقی",
    icon: <Wallet className="h-6 w-6" />,
  },
  {
    title: "حقوق دستمزد (وزارت کار)",
    desc: "مصوبه سالانه وزارت کار",
    icon: <FileCheck className="h-6 w-6" />,
  },
  {
    title: "حق بیمه پیمانکاری (ماده ۳۸)",
    desc: "ضریب قانونی + بیمه بیکاری",
    icon: <Receipt className="h-6 w-6" />,
  },
];

const filterChips = [
  "همه محاسبه‌گرها",
  "حقوق و دستمزد",
  "بیمه",
  "مالیات کسب‌وکار",
  "جرایم مالیاتی",
  "مالیات سوداگری",
  "مالیات نقل و انتقال",
  "املاک و مستغلات",
  "طلا و سکه",
  "ملک، ارث و چک",
  "تحلیل مالی و حسابداری",
  "آزمون‌ها",
  "مالیات",
];

export function HubView({ onOpenCompare }: { onOpenCompare: () => void }) {
  const { toast } = useToast();
  const [activeChip, setActiveChip] = useState("همه محاسبه‌گرها");
  const categories = makeCategories(onOpenCompare);

  const notifySoon = (title: string) =>
    toast({
      title: "این ابزار به‌زودی فعال می‌شود",
      description: `«${title}» در نسخه‌های بعدی به ماشین‌حساب تعاملی تبدیل می‌شود.`,
    });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-yellow-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-yellow-50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1 rounded-full text-xs font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500 ml-1" />
                همه فرم‌های مالیاتی در یک‌جا
              </Badge>
              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
                محاسبه‌گرهای آنلاین
                <br />
                مالیاتی و{" "}
                <mark className="bg-yellow-300 text-slate-900 px-2 rounded-md">
                  کسب‌وکاری
                </mark>
              </h1>
              <p className="mt-4 text-slate-600 text-sm md:text-base max-w-2xl leading-7">
                این ابزارها برای محاسبه سریع و تصمیم‌گیری اولیه طراحی شده‌اند.
                برای پرونده‌های حساس، بررسی تخصصی لازم است.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4 max-w-lg">
                <StatCard number="۴۳" label="ابزار" />
                <StatCard number="۱۲" label="دسته" />
                <StatCard number="رایگان" label="بدون ثبت‌نام" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular forms */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            پرکاربردترین فرم‌ها
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {popularForms.map((f) => (
              <button
                key={f.title}
                onClick={() => notifySoon(f.title)}
                className="group text-right bg-white rounded-xl border border-slate-200 p-4 md:p-5 hover:border-yellow-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="grid place-items-center h-11 w-11 rounded-xl bg-yellow-50 text-yellow-700 group-hover:bg-yellow-100 transition-colors">
                    {f.icon}
                  </span>
                  <ArrowLeft className="h-4 w-4 text-slate-300 group-hover:text-yellow-600 transition-colors" />
                </div>
                <h3 className="mt-3 font-bold text-slate-900 text-sm leading-6">
                  {f.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{f.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filter chips */}
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterChips.map((chip) => (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  activeChip === chip
                    ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-yellow-300 hover:text-slate-900"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories
        .filter(
          (c) => activeChip === "همه محاسبه‌گرها" || activeChip === c.title
        )
        .map((cat) => (
          <section key={cat.id} id={cat.id} className="py-5">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">{cat.title}</h2>
                <span className="text-xs text-slate-500">
                  مشاهده همه ({cat.count.toLocaleString("fa-IR")})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {cat.items.map((it) => (
                  <article
                    key={it.title}
                    onClick={() =>
                      it.action
                        ? it.action()
                        : notifySoon(it.title)
                    }
                    className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-full hover:border-yellow-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-900 text-sm leading-6 flex-1">
                        {it.title}
                      </h3>
                      <span className="grid place-items-center h-10 w-10 shrink-0 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200 group-hover:bg-yellow-100 transition-colors">
                        {it.icon}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-600 leading-6 flex-1">
                      {it.desc}
                    </p>
                    <span className="mt-4 self-start inline-flex items-center gap-1 text-xs font-bold text-slate-900 bg-yellow-400 hover:bg-yellow-500 px-3 py-1.5 rounded-full transition-colors">
                      {it.action ? "شروع مقایسه" : "محاسبه کن"}
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}

      {/* CTA */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-l from-slate-900 to-slate-800 rounded-2xl p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 px-3 py-1 rounded-full text-xs">
                <Sparkles className="h-3.5 w-3.5 ml-1" />
                راهنمای انتخاب ابزار
              </Badge>
              <h2 className="mt-3 text-2xl md:text-3xl font-extrabold text-white">
                کدام محاسبه‌گر به کار شما می‌آید؟
              </h2>
              <p className="mt-4 text-slate-300 text-sm md:text-base leading-7 max-w-3xl">
                انتخاب ابزار درست، نصف کار است. برای کارفرمایان، «محاسبه حقوق
                طبق قانون کار» نقطه شروع است و برای صاحبان کسب‌وکار، مسیر معمول
                از «مالیات مشاغل» یا «مالیات شرکت‌ها» می‌گذرد؛ اگر فروش سالانه
                زیر نصاب باشد، «تبصره ۱۰۰» راه ساده‌تری پیش پا می‌گذارد.
              </p>
              <p className="mt-3 text-slate-400 text-xs leading-6 max-w-3xl">
                این ابزارها بر اساس قوانین، بخشنامه‌ها و آیین‌نامه‌های جاری
                تنظیم شده‌اند و با تغییر مقررات به‌روز می‌شوند. با این حال نتیجه
                آن‌ها جایگزین بررسی تخصصی پرونده نیست.
              </p>
              <Button
                onClick={onOpenCompare}
                className="mt-6 bg-yellow-400 text-slate-900 hover:bg-yellow-500 rounded-full px-5"
              >
                شروع با مقایسه اظهارنامه و تبصره ۱۰۰
                <ArrowLeft className="h-4 w-4 mr-1" />
              </Button>
            </div>
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
              پاسخ پرسش‌های رایج درباره فرم‌های مالیاتی
            </h2>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 md:p-5 flex flex-col items-start">
      <span className="text-2xl md:text-3xl font-extrabold text-yellow-400 leading-none">
        {number}
      </span>
      <span className="mt-1 text-xs md:text-sm text-slate-300">{label}</span>
    </div>
  );
}
