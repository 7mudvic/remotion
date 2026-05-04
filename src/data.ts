import type {Dish} from './scenes/DishShowcase';

/**
 * Brand: عَريكة البلدة — full menu (21 dishes).
 *
 * File naming convention: `dishes/dish-NN-slug.png`
 *   NN  → 01..21 (matches display order in this list)
 *   slug → short English description
 *
 * Each dish PNG must have a fully transparent background and contain
 * the wooden plate (with optional cardboard mat backing) only.
 */
export const BRAND = {
  nameAr: 'عَريكة البلدة',
  nameEn: 'AREEKAT AL-BALAD',
  taglineAr: 'نكهة أصيلة من قلب البلد',
  callToActionAr: 'تفضّلوا بزيارتنا',
  logoSrc: 'logo.png' as string | undefined,
};

export const DISHES: Dish[] = [
  // — حلو ————————————————————————————————————————
  {
    image: 'dishes/dish-01-banana.png',
    nameAr: 'مطبّق حلو موز',
    nameEn: 'Sweet Banana',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-02-cream-cheese.png',
    nameAr: 'مطبّق حلو قشطة وجبن',
    nameEn: 'Sweet Cream & Cheese',
    descriptionAr: '',
    price: '9 ر.س',
  },
  {
    image: 'dishes/dish-03-tuna-veggie-2cheese.png',
    nameAr: 'مطبّق تونة خضار وجبنتين',
    nameEn: 'Tuna · Veggie · Two Cheeses',
    descriptionAr: '',
    price: '14 ر.س',
  },
  {
    image: 'dishes/dish-04-2cheese.png',
    nameAr: 'مطبّق جبنتين',
    nameEn: 'Two Cheeses',
    descriptionAr: '',
    price: '9 ر.س',
  },
  {
    image: 'dishes/dish-05-cream.png',
    nameAr: 'مطبّق حلو قشطة',
    nameEn: 'Sweet Cream',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-06-tuna.png',
    nameAr: 'مطبّق تونة',
    nameEn: 'Tuna',
    descriptionAr: '',
    price: '8 ر.س',
  },
  {
    image: 'dishes/dish-07-tuna-2cheese.png',
    nameAr: 'مطبّق تونة وجبنتين',
    nameEn: 'Tuna & Two Cheeses',
    descriptionAr: '',
    price: '12 ر.س',
  },
  {
    image: 'dishes/dish-08-sweet-cheese.png',
    nameAr: 'مطبّق حلو جبن',
    nameEn: 'Sweet Cheese',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-09-liver-cheese.png',
    nameAr: 'مطبّق كبدة وجبن',
    nameEn: 'Liver & Cheese',
    descriptionAr: '',
    price: '21 ر.س',
  },
  {
    image: 'dishes/dish-10-savoury.png',
    nameAr: 'مطبّق مالح',
    nameEn: 'Savoury',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-11-kraft-plain.png',
    nameAr: 'مطبّق كرافت سادة',
    nameEn: 'Plain Kraft',
    descriptionAr: '',
    price: '8 ر.س',
  },
  {
    image: 'dishes/dish-12-nutella.png',
    nameAr: 'مطبّق نوتيلا',
    nameEn: 'Nutella',
    descriptionAr: '',
    price: '9 ر.س',
  },
  {
    image: 'dishes/dish-13-tuna-veggie-melt.png',
    nameAr: 'مطبّق تونة خضار وجبن سايل',
    nameEn: 'Tuna · Veggie · Melty Cheese',
    descriptionAr: '',
    price: '12 ر.س',
  },
  {
    image: 'dishes/dish-14-chicken-veggie-kraft.png',
    nameAr: 'مطبّق دجاج خضار وكرافت',
    nameEn: 'Chicken · Veggie · Kraft',
    descriptionAr: '',
    price: '9 ر.س',
  },
  {
    image: 'dishes/dish-15-salty-cheese.png',
    nameAr: 'مطبّق جبن مالح',
    nameEn: 'Salty Cheese',
    descriptionAr: '',
    price: '8 ر.س',
  },
  {
    image: 'dishes/dish-16-kraft-veggie.png',
    nameAr: 'مطبّق كرافت وخضار',
    nameEn: 'Kraft & Veggie',
    descriptionAr: '',
    price: '9 ر.س',
  },
  {
    image: 'dishes/dish-17-chicken-veggie.png',
    nameAr: 'مطبّق دجاج وخضار',
    nameEn: 'Chicken & Veggie',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-18-meat-veggie-kraft.png',
    nameAr: 'مطبّق لحم خضار وكرافت',
    nameEn: 'Meat · Veggie · Kraft',
    descriptionAr: '',
    price: '10 ر.س',
  },
  {
    image: 'dishes/dish-19-veggie.png',
    nameAr: 'مطبّق خضار',
    nameEn: 'Veggie',
    descriptionAr: '',
    price: '7 ر.س',
  },
  {
    image: 'dishes/dish-20-quesadilla-chicken.png',
    nameAr: 'مطبّق كاساديا دجاج',
    nameEn: 'Chicken Quesadilla',
    descriptionAr: '',
    price: '21 ر.س',
  },
  {
    image: 'dishes/dish-21-veggie-melt.png',
    nameAr: 'مطبّق خضار وجبن سايل',
    nameEn: 'Veggie & Melty Cheese',
    descriptionAr: '',
    price: '9 ر.س',
  },
];

// Timing (frames @ 30 fps)
export const FPS = 30;
export const DISH_FRAMES = 195; // 6.5s each — comfortable reading pace
export const TRANSITION_FRAMES = 18; // 0.6s overlap (fade)
//
// Total = DISH_FRAMES × N − TRANSITION_FRAMES × (N − 1)
//       = 195 × 21 − 18 × 20  =  4095 − 360  =  3735 frames  ≈  124.5 s (2:04)


// ──────────────────────────────────────────────────────────────────
// AREEKA / MASOUB MENU (15 signature dishes, 3 sizes each)
//
// Filename convention: `dishes/areeka-NN-slug.png`
// Every dish here ships with three sizes (صغير / وسط / كبير) and is
// rendered with the editorial-typography price layout (Design 4).
// nameEn is intentionally omitted — Arabic only on these scenes.
// ──────────────────────────────────────────────────────────────────

export const AREEKA_DISHES: Dish[] = [
  {
    image: 'dishes/areeka-01-balad.png',
    nameAr: 'عَريكة البلدة',
    prices: [
      {label: 'صغير', value: '16 ر.س'},
      {label: 'وسط', value: '21 ر.س'},
      {label: 'كبير', value: '37 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-02-masoub-cream-honey-cheese.png',
    nameAr: 'معصوب قشطة عسل جبن',
    prices: [
      {label: 'صغير', value: '15 ر.س'},
      {label: 'وسط', value: '20 ر.س'},
      {label: 'كبير', value: '32 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-03-banana.png',
    nameAr: 'عَريكة شرايح موز',
    prices: [
      {label: 'صغير', value: '17 ر.س'},
      {label: 'وسط', value: '22 ر.س'},
      {label: 'كبير', value: '34 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-04-balad-dukhn.png',
    nameAr: 'عَريكة البلدة دخن',
    prices: [
      {label: 'صغير', value: '17 ر.س'},
      {label: 'وسط', value: '22 ر.س'},
      {label: 'كبير', value: '37 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-05-balad-vip.png',
    nameAr: 'عَريكة البلدة VIP',
    prices: [
      {label: 'صغير', value: '21 ر.س'},
      {label: 'وسط', value: '26 ر.س'},
      {label: 'كبير', value: '42 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-06-masoub-balad.png',
    nameAr: 'معصوب البلدة',
    prices: [
      {label: 'صغير', value: '16 ر.س'},
      {label: 'وسط', value: '21 ر.س'},
      {label: 'كبير', value: '37 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-07-southern.png',
    nameAr: 'عَريكة جنوبية',
    prices: [
      {label: 'صغير', value: '25 ر.س'},
      {label: 'وسط', value: '40 ر.س'},
      {label: 'كبير', value: '65 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-08-masoub-jeddah.png',
    nameAr: 'معصوب جداوي',
    prices: [
      {label: 'صغير', value: '16 ر.س'},
      {label: 'وسط', value: '21 ر.س'},
      {label: 'كبير', value: '34 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-09-cream-honey-nuts.png',
    nameAr: 'عَريكة قشطة عسل ومكسرات',
    prices: [
      {label: 'صغير', value: '17 ر.س'},
      {label: 'وسط', value: '22 ر.س'},
      {label: 'كبير', value: '34 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-10-masoub-balad-vip.png',
    nameAr: 'معصوب البلدة VIP',
    prices: [
      {label: 'صغير', value: '21 ر.س'},
      {label: 'وسط', value: '26 ر.س'},
      {label: 'كبير', value: '42 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-11-cream-honey.png',
    nameAr: 'عَريكة قشطة وعسل',
    prices: [
      {label: 'صغير', value: '15 ر.س'},
      {label: 'وسط', value: '20 ر.س'},
      {label: 'كبير', value: '32 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-12-marsa.png',
    nameAr: 'مرسى',
    prices: [
      {label: 'صغير', value: '12 ر.س'},
      {label: 'وسط', value: '16 ر.س'},
      {label: 'كبير', value: '32 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-13-masoub-plain.png',
    nameAr: 'معصوب عادي',
    prices: [
      {label: 'صغير', value: '6 ر.س'},
      {label: 'وسط', value: '10 ر.س'},
      {label: 'كبير', value: '22 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-14-masoub-royal.png',
    nameAr: 'معصوب ملكي',
    prices: [
      {label: 'صغير', value: '17 ر.س'},
      {label: 'وسط', value: '20 ر.س'},
      {label: 'كبير', value: '39 ر.س'},
    ],
  },
  {
    image: 'dishes/areeka-15-royal.png',
    nameAr: 'عَريكة ملكي',
    prices: [
      {label: 'صغير', value: '17 ر.س'},
      {label: 'وسط', value: '22 ر.س'},
      {label: 'كبير', value: '39 ر.س'},
    ],
  },
];

