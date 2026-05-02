import type {Dish} from './scenes/DishShowcase';

/**
 * Brand: عَريكة البلدة
 *
 * Asset paths (relative to /public):
 *   logo.png            ← yellow-oval logo (transparent background)
 *   dishes/dish-1.jpg   ← مطبّق جبن مالح
 *   dishes/dish-2.jpg   ← مطبّق تونة
 *   dishes/dish-3.jpg   ← مطبّق تونة وجبن
 */
export const BRAND = {
  nameAr: 'عَريكة البلدة',
  nameEn: 'AREEKAT AL-BALAD',
  taglineEn: 'Authentic Hejazi Areeka',
  taglineAr: 'نكهة أصيلة من قلب البلد',
  callToActionAr: 'تفضّلوا بزيارتنا · شهيّتكم',
  logoSrc: 'logo.png' as string | undefined,
};

export const DISHES: Dish[] = [
  {
    image: 'dishes/dish-1.jpg',
    nameAr: 'مطبّق جبن مالح',
    nameEn: 'Salty Cheese Mutabbaq',
    descriptionAr:
      'عريكة طازجة محشوّة بالجبن المالح الأصيل، مخبوزة على الصاج بنكهة بيتية لا تُقاوم.',
    price: '20 ر.س',
    badge: 'الأكثر طلباً · BEST SELLER',
    panDirection: 'in',
  },
  {
    image: 'dishes/dish-2.jpg',
    nameAr: 'مطبّق تونة',
    nameEn: 'Tuna Mutabbaq',
    descriptionAr:
      'قطع تونة فاخرة فوق طبقات العريكة الذهبية، نكهة بحرية غنية بطعم البلد.',
    price: '25 ر.س',
    badge: "اختيار الشيف · CHEF'S PICK",
    panDirection: 'diagonal',
  },
  {
    image: 'dishes/dish-3.jpg',
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
