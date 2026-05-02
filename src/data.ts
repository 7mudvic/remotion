import type {Dish} from './scenes/DishShowcase';

/**
 * Brand: عَريكة البلدة
 *
 * 1) Drop your real assets into the public/ folder:
 *      public/logo.png             ← yellow-oval logo
 *      public/dishes/dish-1.jpg    ← مطبّق جبن مالح
 *      public/dishes/dish-2.jpg    ← مطبّق تونة
 *      public/dishes/dish-3.jpg    ← مطبّق تونة وجبن
 *
 * 2) Then change the file extensions below from .svg → .png / .jpg.
 *
 * Until you do that, the included blue/yellow .svg placeholders render so
 * the studio is never empty.
 */
export const BRAND = {
  nameAr: 'عَريكة البلدة',
  nameEn: 'AREEKAT AL-BALAD',
  taglineEn: 'Authentic Hejazi Areeka',
  taglineAr: 'نكهة أصيلة من قلب البلد',
  callToActionAr: 'تفضّلوا بزيارتنا · شهيّتكم',
  // Change to 'logo.png' once you've copied the real logo into /public.
  logoSrc: 'logo.svg' as string | undefined,
};

export const DISHES: Dish[] = [
  {
    image: 'dishes/dish-1.svg',
    nameAr: 'مطبّق جبن مالح',
    nameEn: 'Salty Cheese Mutabbaq',
    descriptionAr:
      'عريكة طازجة محشوّة بالجبن المالح الأصيل، مخبوزة على الصاج بنكهة بيتية لا تُقاوم.',
    price: '20 ر.س',
    badge: 'الأكثر طلباً · BEST SELLER',
    panDirection: 'in',
  },
  {
    image: 'dishes/dish-2.svg',
    nameAr: 'مطبّق تونة',
    nameEn: 'Tuna Mutabbaq',
    descriptionAr:
      'قطع تونة فاخرة فوق طبقات العريكة الذهبية، نكهة بحرية غنية بطعم البلد.',
    price: '25 ر.س',
    badge: "اختيار الشيف · CHEF'S PICK",
    panDirection: 'diagonal',
  },
  {
    image: 'dishes/dish-3.svg',
    nameAr: 'مطبّق تونة وجبن',
    nameEn: 'Tuna & Cheese Mutabbaq',
    descriptionAr:
      'تزاوج مثالي بين التونة والجبن المالح فوق عريكة مقرمشة، تجربة لا تُنسى.',
    price: '22 ر.س',
    badge: 'مزيج العريكة · SIGNATURE BLEND',
    panDirection: 'left',
  },
];

// Timing constants (frames @ 30 fps)
export const FPS = 30;
export const INTRO_FRAMES = 150; // 5s
export const DISH_FRAMES = 210; // 7s each
export const OUTRO_FRAMES = 150; // 5s
export const TRANSITION_FRAMES = 24; // 0.8s overlap between scenes
