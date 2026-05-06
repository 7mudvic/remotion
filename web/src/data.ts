/**
 * Menu data for the web tablet view. Mirrors src/data.ts from the
 * Remotion project — when Remotion prices change, sync them here.
 */

export type PriceItem = {label: string; value: string};

export type Dish = {
  /** path inside web/public/dishes/ — symlinked to ../public/dishes */
  image: string;
  nameAr: string;
  nameEn?: string;
  /** single price ("8 ر.س") OR `prices` array — never both */
  price?: string;
  prices?: PriceItem[];
  /** category for the tab system */
  category: 'mutabbaq' | 'areeka';
  /** sub-tag for filtering: حلو vs مالح */
  flavour?: 'sweet' | 'savory';
};

export const CATEGORIES = [
  {id: 'mutabbaq', labelAr: 'قسم المطبّق'},
  {id: 'areeka', labelAr: 'قسم العَريكة والمعصوب'},
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

const sweetEn = (en: string): boolean =>
  /sweet|banana|cream|nutella/i.test(en);

// ── 21 Mutabbaq dishes — single price each ──
export const MUTABBAQ: Dish[] = [
  {image: 'dishes/dish-01-banana.png',                nameAr: 'مطبّق حلو موز',                  nameEn: 'Sweet Banana',          price: '6 ر.س',  category: 'mutabbaq', flavour: 'sweet'},
  {image: 'dishes/dish-02-cream-cheese.png',          nameAr: 'مطبّق حلو قشطة وجبن',           nameEn: 'Sweet Cream & Cheese',  price: '8 ر.س',  category: 'mutabbaq', flavour: 'sweet'},
  {image: 'dishes/dish-03-tuna-veggie-2cheese.png',   nameAr: 'مطبّق تونة خضار وجبنتين',       nameEn: 'Tuna · Veggie · 2 Cheeses', price: '12 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-04-2cheese.png',               nameAr: 'مطبّق جبنتين',                  nameEn: 'Two Cheeses',           price: '8 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-05-cream.png',                 nameAr: 'مطبّق حلو قشطة',                nameEn: 'Sweet Cream',           price: '6 ر.س',  category: 'mutabbaq', flavour: 'sweet'},
  {image: 'dishes/dish-06-tuna.png',                  nameAr: 'مطبّق تونة',                    nameEn: 'Tuna',                  price: '7 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-07-tuna-2cheese.png',          nameAr: 'مطبّق تونة وجبنتين',           nameEn: 'Tuna & Two Cheeses',   price: '10 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-08-sweet-cheese.png',          nameAr: 'مطبّق حلو جبن',                 nameEn: 'Sweet Cheese',          price: '6 ر.س',  category: 'mutabbaq', flavour: 'sweet'},
  {image: 'dishes/dish-09-liver-cheese.png',          nameAr: 'مطبّق كبدة وجبن',               nameEn: 'Liver & Cheese',        price: '18 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-10-savoury.png',               nameAr: 'مطبّق مالح',                    nameEn: 'Savoury',               price: '6 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-11-kraft-plain.png',           nameAr: 'مطبّق كرافت سادة',              nameEn: 'Plain Kraft',           price: '7 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-12-nutella.png',               nameAr: 'مطبّق نوتيلا',                  nameEn: 'Nutella',               price: '8 ر.س',  category: 'mutabbaq', flavour: 'sweet'},
  {image: 'dishes/dish-13-tuna-veggie-melt.png',      nameAr: 'مطبّق تونة خضار وجبن سايل',    nameEn: 'Tuna · Veggie · Melty Cheese', price: '10 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-14-chicken-veggie-kraft.png',  nameAr: 'مطبّق دجاج خضار وكرافت',        nameEn: 'Chicken · Veggie · Kraft', price: '9 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-15-salty-cheese.png',          nameAr: 'مطبّق جبن مالح',                nameEn: 'Salty Cheese',          price: '7 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-16-kraft-veggie.png',          nameAr: 'مطبّق كرافت وخضار',             nameEn: 'Kraft & Veggie',        price: '8 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-17-chicken-veggie.png',        nameAr: 'مطبّق دجاج وخضار',              nameEn: 'Chicken & Veggie',      price: '6 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-18-meat-veggie-kraft.png',     nameAr: 'مطبّق لحم خضار وكرافت',         nameEn: 'Meat · Veggie · Kraft', price: '9 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-19-veggie.png',                nameAr: 'مطبّق خضار',                    nameEn: 'Veggie',                price: '6 ر.س',  category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-20-quesadilla-chicken.png',    nameAr: 'مطبّق كاساديا دجاج',           nameEn: 'Chicken Quesadilla',    price: '18 ر.س', category: 'mutabbaq', flavour: 'savory'},
  {image: 'dishes/dish-21-veggie-melt.png',           nameAr: 'مطبّق خضار وجبن سايل',          nameEn: 'Veggie & Melty Cheese', price: '8 ر.س',  category: 'mutabbaq', flavour: 'savory'},
];

// ── 15 Areeka / Masoub dishes — three sizes each ──
const sizes = (s: number, m: number, l: number): PriceItem[] => [
  {label: 'صغير', value: `${s} ر.س`},
  {label: 'وسط', value: `${m} ر.س`},
  {label: 'كبير', value: `${l} ر.س`},
];

export const AREEKA: Dish[] = [
  {image: 'dishes/areeka-01-balad.png',                       nameAr: 'عَريكة البلدة',           prices: sizes(13, 17, 30), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-02-masoub-cream-honey-cheese.png',   nameAr: 'معصوب قشطة عسل جبن',     prices: sizes(12, 16, 26), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-03-banana.png',                      nameAr: 'عَريكة شرايح موز',       prices: sizes(14, 18, 28), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-04-balad-dukhn.png',                 nameAr: 'عَريكة البلدة دخن',      prices: sizes(14, 18, 30), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-05-balad-vip.png',                   nameAr: 'عَريكة البلدة VIP',     prices: sizes(17, 21, 34), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-06-masoub-balad.png',                nameAr: 'معصوب البلدة',           prices: sizes(13, 17, 30), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-07-southern.png',                    nameAr: 'عَريكة جنوبية',         prices: sizes(25, 40, 65), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-08-masoub-jeddah.png',               nameAr: 'معصوب جداوي',           prices: sizes(13, 17, 28), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-09-cream-honey-nuts.png',            nameAr: 'عَريكة قشطة عسل ومكسرات', prices: sizes(14, 18, 28), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-10-masoub-balad-vip.png',            nameAr: 'معصوب البلدة VIP',       prices: sizes(17, 21, 34), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-11-cream-honey.png',                 nameAr: 'عَريكة قشطة وعسل',       prices: sizes(12, 16, 26), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-12-marsa.png',                       nameAr: 'مرسى',                  prices: sizes(10, 13, 26), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-13-masoub-plain.png',                nameAr: 'معصوب عادي',            prices: sizes(5, 8, 18),   category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-14-masoub-royal.png',                nameAr: 'معصوب ملكي',            prices: sizes(14, 16, 32), category: 'areeka', flavour: 'sweet'},
  {image: 'dishes/areeka-15-royal.png',                       nameAr: 'عَريكة ملكي',           prices: sizes(14, 18, 32), category: 'areeka', flavour: 'sweet'},
];

export const ALL_DISHES: Dish[] = [...MUTABBAQ, ...AREEKA];

/**
 * "أصناف مميزة" — three signature dishes pinned to the top of the
 * tablet menu so they're the first thing a customer sees.
 */
export const FEATURED_IMAGES = [
  'dishes/dish-03-tuna-veggie-2cheese.png',
  'dishes/areeka-01-balad.png',
  'dishes/areeka-07-southern.png',
] as const;

export const FEATURED_DISHES: Dish[] = FEATURED_IMAGES.map(
  (img) => ALL_DISHES.find((d) => d.image === img)!,
);

/** Smallest price as a number, used for "starts at" labels on cards. */
export const startingPrice = (d: Dish): number => {
  if (d.prices && d.prices.length > 0) {
    return Math.min(
      ...d.prices.map((p) => parseInt(p.value.replace(/[^\d]/g, ''), 10)),
    );
  }
  if (d.price) return parseInt(d.price.replace(/[^\d]/g, ''), 10);
  return 0;
};

void sweetEn; // reserved for future EN-name based heuristics
