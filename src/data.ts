import type {Dish} from './scenes/DishShowcase';

/**
 * Brand: عَريكة البلدة
 *
 * Asset paths (relative to /public):
 *   logo.png            ← الشعار (خلفية شفافة)
 *   dishes/dish-1.jpg   ← مطبّق جبن مالح
 *   dishes/dish-2.jpg   ← مطبّق تونة
 *   dishes/dish-3.jpg   ← مطبّق تونة وجبن
 */
export const BRAND = {
  nameAr: 'عَريكة البلدة',
  nameEn: 'AREEKAT AL-BALAD',
  taglineAr: 'نكهة أصيلة من قلب البلد',
  callToActionAr: 'تفضّلوا بزيارتنا',
  logoSrc: 'logo.png' as string | undefined,
};

export const DISHES: Dish[] = [
  {
    image: 'dishes/dish-1.jpg',
    nameAr: 'مطبّق جبن مالح',
    nameEn: 'Cheese Mutabbaq',
    descriptionAr: 'عريكة طازجة بحشوة الجبن المالح الأصيل.',
    price: '20 ر.س',
    badge: 'الأكثر طلباً',
  },
  {
    image: 'dishes/dish-2.jpg',
    nameAr: 'مطبّق تونة',
    nameEn: 'Tuna Mutabbaq',
    descriptionAr: 'قطع تونة فاخرة فوق طبقات العريكة الذهبية.',
    price: '25 ر.س',
    badge: 'اختيار الشيف',
  },
  {
    image: 'dishes/dish-3.jpg',
    nameAr: 'مطبّق تونة وجبن',
    nameEn: 'Tuna & Cheese Mutabbaq',
    descriptionAr: 'تزاوج مثالي بين التونة والجبن فوق عريكة مقرمشة.',
    price: '22 ر.س',
    badge: 'مزيج العريكة',
  },
];

// Timing (frames @ 30 fps)
export const FPS = 30;
export const INTRO_FRAMES = 135; // 4.5s
export const DISH_FRAMES = 195; // 6.5s each
export const OUTRO_FRAMES = 135; // 4.5s
export const TRANSITION_FRAMES = 18; // 0.6s overlap
