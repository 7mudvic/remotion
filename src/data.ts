import type {Dish} from './scenes/DishShowcase';

/**
 * Edit this object to rebrand the slideshow without touching component code.
 * `logoSrc` and every `dish.image` are paths relative to /public.
 *
 * Drop your own files into:
 *   public/logo.png        (or .svg / .webp - any path works)
 *   public/dishes/*.jpg
 * then update the strings below.
 */
export const BRAND = {
  nameAr: 'مطعمي',
  nameEn: 'MATAAMI',
  taglineEn: 'A Taste of Tradition',
  callToActionAr: 'تفضّلوا بزيارتنا · شهيّتكم',
  // Optional - will use a built-in placeholder if undefined.
  // Drop your real file (PNG/SVG/WEBP) into /public and update the name.
  logoSrc: 'logo.svg' as string | undefined,
};

export const DISHES: Dish[] = [
  {
    image: 'dishes/dish-1.svg',
    nameAr: 'الطبق الأول',
    nameEn: 'Signature Dish I',
    descriptionAr:
      'نكهة شرقية أصيلة بلمسة الشيف، تُقدَّم طازجة بأجود المكونات المختارة بعناية.',
    price: '45 ر.س',
    badge: 'CHEF’S SELECTION',
    panDirection: 'in',
  },
  {
    image: 'dishes/dish-2.svg',
    nameAr: 'الطبق الثاني',
    nameEn: 'Signature Dish II',
    descriptionAr:
      'مزيج متناغم من البهارات والروائح، يأخذك في رحلة ذوقية لا تُنسى.',
    price: '55 ر.س',
    badge: 'HOUSE FAVORITE',
    panDirection: 'diagonal',
  },
  {
    image: 'dishes/dish-3.svg',
    nameAr: 'الطبق الثالث',
    nameEn: 'Signature Dish III',
    descriptionAr:
      'إبداع جديد من مطبخنا، يجمع بين الأصالة والحداثة في طبقٍ واحد.',
    price: '60 ر.س',
    badge: 'NEW · جديد',
    panDirection: 'left',
  },
];

// Timing constants (frames @ 30 fps)
export const FPS = 30;
export const INTRO_FRAMES = 150; // 5s
export const DISH_FRAMES = 210; // 7s each
export const OUTRO_FRAMES = 150; // 5s
export const TRANSITION_FRAMES = 24; // 0.8s overlap between scenes
