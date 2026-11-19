// گزیده‌ای از ضرایب سود فعالیت (اینتاکد) برای مشاغل رایج — سال ۱۴۰۵
// منبع ضرایب: جدول رسمی ضریب سود فعالیت سازمان امور مالیاتی کشور.
// توجه: این فهرست «گزیده‌ای از مشاغل رایج» است و نه فهرست کامل رسمی.
// جدول کامل در https://www.tax.gov.ir/action/do/listintacode قابل استعلام است.

export type IntacodeEntry = {
  title: string;
  sector: string;
  coefficient: number; // ضریب سود فعالیت به «درصد» (مثلاً ۱۵ یعنی ۱۵٪)
  year: string;
};

export const INTACODE_YEAR = "1405";

export const INTACODE_SECTORS = [
  "خرده‌فروشی و خواربار",
  "غذا و مهمان‌داری",
  "سلامت",
  "خدمات و فنی",
] as const;

export const INTACODE_NOTE =
  "این فهرست گزیده‌ای از ضرایب سود فعالیت (اینتاکد) سال ۱۴۰۵ برای مشاغل رایج است و برای برآورد اولیه به‌کار می‌رود. جدول کامل و رسمی ضرایب در سازمان امور مالیاتی کشور قابل استعلام است؛ ضریب دقیق هر فعالیت را پیش از تصمیم نهایی از منبع رسمی استعلام کنید.";

export const INTACODE_ENTRIES: IntacodeEntry[] = [
  // خرده‌فروشی و خواربار
  { title: "سوپرمارکت و فروش مواد غذایی", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "نانوایی (بربری، سنگک، لواش)", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "فروش میوه و سبزی", sector: "خرده‌فروشی و خواربار", coefficient: 20, year: "1405" },
  { title: "قصابی و فروش گوشت", sector: "خرده‌فروشی و خواربار", coefficient: 20, year: "1405" },
  { title: "فروش مرغ و تخم‌مرغ", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "لبنیات‌فروشی", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "فروش آبمیوه، بستنی و فالوده", sector: "خرده‌فروشی و خواربار", coefficient: 18.4, year: "1405" },
  { title: "فروش پوشاک و منسوجات", sector: "خرده‌فروشی و خواربار", coefficient: 25, year: "1405" },
  { title: "کفش و چرم‌فروشی", sector: "خرده‌فروشی و خواربار", coefficient: 25, year: "1405" },
  { title: "طلا و جواهرفروشی", sector: "خرده‌فروشی و خواربار", coefficient: 8, year: "1405" },
  { title: "فروش موبایل و لوازم جانبی", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "فروش لوازم خانگی", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  { title: "فروش قطعات و لوازم خودرو", sector: "خرده‌فروشی و خواربار", coefficient: 20, year: "1405" },
  { title: "فروش مصالح ساختمانی", sector: "خرده‌فروشی و خواربار", coefficient: 15, year: "1405" },
  // غذا و مهمان‌داری
  { title: "رستوران و فست‌فود", sector: "غذا و مهمان‌داری", coefficient: 25, year: "1405" },
  { title: "کافه و چایخانه", sector: "غذا و مهمان‌داری", coefficient: 25, year: "1405" },
  // سلامت
  { title: "داروخانه", sector: "سلامت", coefficient: 10, year: "1405" },
  { title: "عطاری", sector: "سلامت", coefficient: 20, year: "1405" },
  { title: "مطب پزشک و کلینیک درمانی", sector: "سلامت", coefficient: 45, year: "1405" },
  { title: "دندانپزشکی", sector: "سلامت", coefficient: 50, year: "1405" },
  // خدمات و فنی
  { title: "تعمیرگاه خودرو (مکانیکی)", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "صافکاری و نقاشی خودرو", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "آرایشگاه و زیبایی", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "آژانس خدمات مسافرتی", sector: "خدمات و فنی", coefficient: 10, year: "1405" },
  { title: "دفتر فنی و مهندسی", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "آموزشگاه آزاد", sector: "خدمات و فنی", coefficient: 25, year: "1405" },
  { title: "چاپ، تبلیغات و گرافیک", sector: "خدمات و فنی", coefficient: 25, year: "1405" },
  { title: "خشکشویی و لباسشویی", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "عکاسی و فیلم‌برداری", sector: "خدمات و فنی", coefficient: 30, year: "1405" },
  { title: "تأسیسات مکانیکی و برقی ساختمان", sector: "خدمات و فنی", coefficient: 35, year: "1405" },
  { title: "حمل‌ونقل کالا و باربری", sector: "خدمات و فنی", coefficient: 25, year: "1405" },
];
