# 🎨 DESIGN PLAYBOOK · عَريكة البلدة

> دليل التصميم الكامل لعرض المنيو على شاشة TV.
> هذا الملف يحتوي على كل ما يلزم لإعادة بناء نفس الستايل من الصفر — قواعد، توكنات، أكواد، وبراومبت جاهز.

This is the complete design playbook for the **Areekat Al-Balad** menu
slideshow. Anyone reading this file (a designer, another developer, or
another AI assistant in a fresh conversation) should be able to rebuild
the exact same look from scratch.

---

## 1 · الفلسفة / Design Philosophy

| Principle | Arabic | الشرح |
|---|---|---|
| **Brand-true, not generic** | هوية أولاً | الألوان والأشكال مأخوذة من الشعار وصور المنيو الموجودة. لا "luxury cinematic" أو "minimal swiss" — بس **هويّة العَريكة**. |
| **RTL first** | عربي أولاً | كل النصوص بالعربي بخط Cairo ضخم، الترتيب من اليمين لليسار، الأرقام بالعربي (٠١٢٣٤٥٦٧٨٩). |
| **Zone layout, never overlap** | مناطق منفصلة | كل عنصر له مكان محدد بـ flex column. لا absolute fills متداخلة. |
| **Hero is the food** | الصورة هي البطل | الصورة بحجم كبير ومركّزة، بدون قص أو تكبير Ken Burns، بـ `object-fit: contain`. |
| **Silent always** | بدون صوت | لا موسيقى ولا مؤثرات صوتية أبداً. |
| **Bold motion, no fluff** | حركة واضحة فقط | spring + slide + fade. لا particles، لا film grain، لا light leaks. |

---

## 2 · توكنات الهوية / Brand Tokens

### الألوان / Colors

```ts
export const THEME = {
  // Royal brand blue (matches the logo background)
  blue:      '#1e3fa3',
  blueHi:    '#2f55c4',
  blueLo:    '#0c1f5a',
  blueDeep:  '#091236',

  // Warm honey-yellow (matches the logo oval)
  yellow:    '#f5c233',
  yellowHi:  '#ffd76b',
  yellowLo:  '#a87b14',

  // Neutrals
  cream:     '#fff8e3',
  ink:       '#0a1638',
  white:     '#ffffff',

  // Soft shadows
  shadowBlue:   'rgba(9, 18, 54, 0.45)',
  shadowYellow: 'rgba(245, 194, 51, 0.45)',
} as const;
```

### الخطوط / Fonts

| استخدام | الخط | الوزن | لماذا |
|---|---|---|---|
| العناوين الكبيرة | **Cairo** | 900 (Black) | عربي ضخم، حواف حادة، مقروء على TV من بعيد |
| الوصف وجسم النص | **Tajawal** | 500-700 | أنظف من Cairo في المقاسات الصغيرة |
| اللمسات الإنجليزية | **Reem Kufi** | 400 | Letter-spacing عالي، يحس "menu-card" |

```ts
import {loadFont as loadCairo}    from '@remotion/google-fonts/Cairo';
import {loadFont as loadTajawal}  from '@remotion/google-fonts/Tajawal';
import {loadFont as loadReemKufi} from '@remotion/google-fonts/ReemKufi';

const cairoH    = loadCairo   ('normal', {subsets: ['arabic','latin'], weights: ['400','700','900'], ignoreTooManyRequestsWarning: true});
const tajawalH  = loadTajawal ('normal', {subsets: ['arabic','latin'], weights: ['400','500','700'], ignoreTooManyRequestsWarning: true});
const reemKufiH = loadReemKufi('normal', {subsets: ['arabic','latin'], weights: ['400','700'],       ignoreTooManyRequestsWarning: true});

export const FONT_FAMILY = {
  cairo:    cairoH.fontFamily,
  tajawal:  tajawalH.fontFamily,
  reemKufi: reemKufiH.fontFamily,
} as const;
```

### المقاسات / Sizes

| Element | Size | Notes |
|---|---|---|
| Frame | **1920 × 1080** @ 30 fps | Also: 4K (3840×2160), Vertical (1080×1920) |
| Dish title (Arabic) | 110 px Cairo Black | letter-spacing: -2 |
| Dish description | 38 px Cairo 700 | line-height: 1.45 |
| English subtitle | 26 px Reem Kufi 400 | letter-spacing: 6, uppercase |
| Index pill | 26 px Cairo 900 | radius 999, padding 8/22 |
| Price badge | 200 px diameter | number 35% of size, unit 13% |
| Padding (horizontal) | 80–100 px | varies per zone |

---

## 3 · شبكة التخطيط / Layout Grid

كل مشهد عرض أصناف يلتزم بهذه الشبكة العمودية الصارمة:

```
┌──────────────────────────────────────────────────┐
│  TOP STRIP                                       │  10%
│  [index pill RIGHT]              [badge LEFT]   │
├──────────────────────────────────────────────────┤
│  TITLE                                           │  18%
│           Arabic title (centered)                │
│              English subtitle                    │
├──────────────────────────────────────────────────┤
│                                                  │
│                                                  │
│              HERO PRODUCT IMAGE                  │  50%
│        (object-fit: contain, no crop)            │
│                                                  │
│                                                  │
├──────────────────────────────────────────────────┤
│  FOOTER                                          │  22%
│  [PRICE LEFT]       [DESCRIPTION RIGHT in RTL]   │
└──────────────────────────────────────────────────┘
```

**القاعدة الأهم:** استخدم `display: flex; flexDirection: column` على
الـ AbsoluteFill الخارجي، وأعطِ كل قسم `height` ثابت بالنسبة المئوية.
SunburstBackground و DecorPattern يبقيان absolute (خلفية فقط)، الباقي
يحط `zIndex: 4` ليطفو فوقهم.

---

## 4 · الحركة / Animation

كل التحريك يستخدم **spring** من Remotion. لا CSS transitions.

| العنصر | التحريك | تأخير | spring config |
|---|---|---|---|
| Index pill (top) | fade-in | 3-18f | — |
| Title | slide down + fade | 6-22f | `damping:14, stiffness:110, mass:0.7` |
| English subtitle | fade only | 18-36f | — |
| Hero product | spring scale + lift | 4f | `damping:14, stiffness:90, mass:1` |
| Description | slide up + fade | 30-50f | `damping:18, stiffness:110, mass:0.7` |
| Price badge | spring scale + slight rotate | 36f | `damping:12, stiffness:110, mass:0.7` |
| Scene fade out | last 18 frames | — | linear interpolate |

**Spring template:**
```ts
const sp = spring({
  frame: frame - DELAY,
  fps,
  config: {damping: 14, stiffness: 110, mass: 0.7},
});
```

**Drift / breath** (للـ hero image و logo):
```ts
const breath = 1 + Math.sin(frame / 28) * 0.012;  // gentle ±1.2% scale
const drift  = Math.sin(t * Math.PI * 2) * 6;     // ±6px Y drift over scene
```

---

## 5 · المكونات / Component Specs

### A · SunburstBackground

خلفية ثنائية اللون (أزرق فوق أصفر تحت أو العكس) + أشعة دائرية تدور ببطء.

**Rules:**
- اللون الأعلى والأسفل من theme (`blue` / `yellow`).
- الأشعة `conic-gradient` بـ 36 شعاع، نصفها rgba فاتح ونصفها rgba داكن.
- الدوران 4°/ثانية.
- `mix-blend-mode: overlay` على طبقة الأشعة فقط.
- variants: `'blueTop' | 'yellowTop' | 'allBlue' | 'allYellow'`.

### B · DecorPattern

شبكات نقاط في الزوايا الأربعة + خطوط مويجات في المنتصف يميناً وشاراً.

**Rules:**
- 4 شبكات نقاط (5×5، نصف قطر 3.5px) في الزوايا.
- موجتين على اليمين واليسار (3 خطوط لكل واحدة).
- لون اللوحة: `THEME.blue` على خلفية صفراء، `THEME.ink` على خلفية زرقاء.
- opacity 0.40-0.55، fade-in بسيط في أول 18 frame.
- `pointer-events: none`.

### C · ProductCard

صورة الطبق، spring تظهر، تطفو ببطء، ظل أزرق ناعم تحتها.

**Rules:**
- `object-fit: contain` (لا قص، لا تشويه).
- `borderRadius: 24`.
- `filter: drop-shadow(0 30px 60px shadowBlue)`.
- spring scale من 0.86 → 1.0 + breath ±1.2%.
- `width × height` يمررها الـparent من زون الـ HERO.

### D · PriceBadge

دائرة صفراء كبيرة فيها السعر، spring + rotate خفيف.

**Rules:**
- دائرة 200-240px قطر.
- `radial-gradient` من yellowHi إلى yellowLo (إحساس 3D).
- إطار خارجي `4px solid blue`.
- inset shadow + drop shadow بـ shadowBlue.
- الرقم Cairo 900 بحجم 35% من القطر، الوحدة Tajawal 700 بحجم 13%.
- spring أولي rotate من -25° → -8° (يعطي لمسة ستيكر).
- breath ±1.8% scale مستمر.

### E · LogoIntro / Outro

**Intro:**
- خلفية `blueTop` (أزرق فوق أصفر تحت).
- الشعار 460×360px وسط الشاشة، spring scale + breath.
- اسم المطعم Cairo Black 96px، cream، يطلع من تحت بـ spring.
- tagline Tajawal 500 38px، yellowHi.

**Outro:**
- خلفية `yellowTop` (مقلوبة عن الـ intro للتوازن).
- نفس الشعار بحجم أصغر.
- اسم المطعم بنفس الحجم لكن لونه أزرق (لأن الخلفية صفراء).
- CTA stamp: حبة دواء أزرق فيها نص أصفر، Cairo 900 44px، إطار أصفر، spring scale.

---

## 6 · التوقيت / Timing

```ts
export const FPS = 30;
export const INTRO_FRAMES      = 135;  // 4.5s
export const DISH_FRAMES       = 195;  // 6.5s each
export const OUTRO_FRAMES      = 135;  // 4.5s
export const TRANSITION_FRAMES = 18;   // 0.6s overlap (fade)
```

**صيغة المدة الكلية:**
```
TOTAL = INTRO + (DISH × N) + OUTRO − TRANSITION × (N + 1)
```
بـ 3 أصناف:  135 + 585 + 135 − 72 = **783 frames ≈ 26.1 ثانية**

كل الانتقالات بين المشاهد **fade فقط**. سلايد ولايف لا يضيفان قيمة لأن
الخلفية متحركة أصلاً.

---

## 7 · الأرقام العربية / Arabic Numerals

أي رقم يظهر للمشاهد (ترقيم الصنف، السعر) يحوّل لأرقام عربية:

```ts
const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const toArabicNumeral = (n: number) =>
  String(n).split('').map(d => arabicDigits[Number(d)] ?? d).join('');
```

> ملاحظة: السعر يظهر كنص جاهز "20 ر.س" في data.ts، فما يحتاج تحويل.
> لكن لو حابب أرقام عربية للسعر، اكتبها مباشرة: "٢٠ ر.س".

---

## 8 · هيكل الملفات / Project Structure

```
src/
├── index.ts                      # Remotion entry
├── Root.tsx                      # 3 compositions: 1080p, 4K, vertical
├── MenuShow.tsx                  # TransitionSeries wiring
├── data.ts                       # BRAND + DISHES (edit me!)
├── theme.ts                      # color tokens
├── fonts.ts                      # font loaders
├── components/
│   ├── SunburstBackground.tsx    # animated rays
│   ├── DecorPattern.tsx          # corner dots + waves
│   ├── ProductCard.tsx           # hero photo
│   └── PriceBadge.tsx            # yellow circular price
└── scenes/
    ├── LogoIntro.tsx
    ├── DishShowcase.tsx
    └── Outro.tsx

public/
├── logo.png                      # transparent yellow oval
└── dishes/
    ├── dish-1.jpg
    ├── dish-2.jpg
    └── dish-3.jpg
```

---

## 9 · القواعد الذهبية / Golden Rules

1. **لا تستخدم Ken Burns** — الزووم يضيع تفاصيل الصورة على شاشة TV.
2. **لا تستخدم film grain أو light leaks** — الهوية playful مو cinematic.
3. **لا تستخدم gradient على نص العنوان** — اللون السادة أوضح.
4. **لا تستخدم letter-spacing سالب على العربي** بدون اختبار — يكسر الحروف.
5. **لا تستخدم خلفية cinematic gold/charcoal** — هوية المطعم أزرق + أصفر فقط.
6. **لا تخلط RTL و LTR في نفس الصف** — استخدم `direction: 'rtl'` على
   الـ container و `direction: 'ltr'` على الإنجليزي ضمنه.
7. **لا تضع موسيقى أو SFX** — أبداً.
8. **حفّظ المناطق منفصلة** — flex column بـ heights ثابتة، لا absolute متداخلة.

---

## 10 · براومبت جاهز للنسخ / Ready-to-Paste Prompt

> انسخ هذا المربع كاملاً وألصقه في بداية أي محادثة جديدة مع Claude (أو أي AI كود) لما تبي تبني فيديو منيو جديد بنفس الستايل:

````markdown
أبني فيديو Remotion لعرض منيو مطعم على شاشة TV بالستايل التالي بالضبط:

**الهوية:**
- أزرق ملكي (#1e3fa3) + أصفر ذهبي (#f5c233) فقط. لا ألوان غيرها في الخلفية.
- الـ palette الكاملة:
  blue:#1e3fa3 blueHi:#2f55c4 blueLo:#0c1f5a blueDeep:#091236
  yellow:#f5c233 yellowHi:#ffd76b yellowLo:#a87b14
  cream:#fff8e3 ink:#0a1638
- الخطوط: Cairo (display, weight 900), Tajawal (body, 500-700), ReemKufi (English accents).
  حمّلها من @remotion/google-fonts بـ subsets ['arabic','latin'].

**الفلسفة:**
- RTL أولاً: كل التخطيط من اليمين لليسار، أرقام عربية (٠١٢٣٤٥٦٧٨٩).
- بدون أي صوت أو موسيقى. silent تماماً.
- Hero الصورة: object-fit:contain، بدون Ken Burns، بدون saturation boost.
- لا film grain، لا particles، لا light leaks، لا gold frames. الإحساس playful مو cinematic.

**التخطيط (لكل مشهد صنف):**
- Frame 1920×1080 @ 30fps
- AbsoluteFill خارجي بـ display:flex flexDirection:column direction:rtl
- 4 zones عمودية بنسب ثابتة:
  10% TOP STRIP: pill ترقيم على اليمين، badge dashed على اليسار
  18% TITLE: عنوان عربي Cairo 900 110px وسط، subtitle ReemKufi 26px تحت
  50% HERO: ProductCard بـ object-fit:contain
  22% FOOTER: PriceBadge على اليسار، description Cairo 700 38px على اليمين
- SunburstBackground و DecorPattern absolute (خلفية فقط)، الباقي zIndex:4

**المكونات الأساسية:**
1. SunburstBackground: خلفية ثنائية اللون (blueTop أو yellowTop) + 36 شعاع conic-gradient يدورون 4°/ثانية + mix-blend-mode:overlay على الأشعة.
2. DecorPattern: 4 شبكات نقاط 5×5 في الزوايا + موجتين يمين/يسار (3 خطوط لكل واحدة).
3. ProductCard: spring scale 0.86→1.0، drop-shadow أزرق ناعم، borderRadius:24، breath ±1.2%.
4. PriceBadge: دائرة 200-240px، radial-gradient yellowHi→yellowLo، إطار 4px أزرق، الرقم Cairo 900 بـ35% من القطر، spring + rotate -25°→-8°.

**الحركة:** كلها spring من Remotion. config افتراضي:
  damping:14, stiffness:110, mass:0.7
الانتقالات بين المشاهد fade فقط (TransitionSeries من @remotion/transitions)، 18 frame.

**التوقيت:**
INTRO=135f (4.5s)، DISH=195f (6.5s) لكل صنف، OUTRO=135f (4.5s)، TRANSITION=18f.
TOTAL = INTRO + DISH×N + OUTRO − TRANSITION×(N+1)

**القاعدة الذهبية:** الصنف الأول blueTop، الثاني yellowTop، الثالث blueTop... يتبادلون.

**الأصول:**
- public/logo.png (شفافة)
- public/dishes/dish-N.jpg
- src/data.ts فيه BRAND + DISHES[] (nameAr, nameEn, descriptionAr, price, badge)

ابدأ ببناء المشروع كاملاً بنفس الستايل.
````

---

## 11 · كاتالوج كامل للأكواد / Full Code Catalogue

كل الأكواد المهمة هنا للنسخ السريع. لو فقدت المستودع تقدر تبني نسخة طبق الأصل من هذي الأكواد + الـprompt فوق.

### `src/theme.ts`
```ts
export const THEME = {
  blue:      '#1e3fa3',
  blueHi:    '#2f55c4',
  blueLo:    '#0c1f5a',
  blueDeep:  '#091236',
  yellow:    '#f5c233',
  yellowHi:  '#ffd76b',
  yellowLo:  '#a87b14',
  cream:     '#fff8e3',
  ink:       '#0a1638',
  white:     '#ffffff',
  shadowBlue:   'rgba(9, 18, 54, 0.45)',
  shadowYellow: 'rgba(245, 194, 51, 0.45)',
} as const;
```

### `src/data.ts` (شكلها العام)
```ts
export const BRAND = {
  nameAr: 'عَريكة البلدة',
  nameEn: 'AREEKAT AL-BALAD',
  taglineAr: 'نكهة أصيلة من قلب البلد',
  callToActionAr: 'تفضّلوا بزيارتنا',
  logoSrc: 'logo.png',
};

export const DISHES = [
  {
    image: 'dishes/dish-1.jpg',
    nameAr: 'مطبّق جبن مالح',
    nameEn: 'Cheese Mutabbaq',
    descriptionAr: 'عريكة طازجة بحشوة الجبن المالح الأصيل.',
    price: '20 ر.س',
    badge: 'الأكثر طلباً',
  },
  // ... add more
];

export const FPS = 30;
export const INTRO_FRAMES = 135;
export const DISH_FRAMES = 195;
export const OUTRO_FRAMES = 135;
export const TRANSITION_FRAMES = 18;
```

### المراجع الكاملة لأكواد المكونات والمشاهد

شف الملفات مباشرة في المستودع — كلها معلّقة بإنجليزي مفصّل:

- `src/components/SunburstBackground.tsx`
- `src/components/DecorPattern.tsx`
- `src/components/ProductCard.tsx`
- `src/components/PriceBadge.tsx`
- `src/scenes/LogoIntro.tsx`
- `src/scenes/DishShowcase.tsx`
- `src/scenes/Outro.tsx`
- `src/MenuShow.tsx`

---

## 12 · checklist للقبول / Acceptance Checklist

قبل ما تعتمد فيديو جديد بنفس الستايل، تأكد:

- [ ] الفيديو 1920×1080 @ 30fps
- [ ] لا صوت ولا موسيقى
- [ ] كل النصوص العربية تظهر RTL وغير مكسورة
- [ ] العنوان والصورة لا يتداخلان
- [ ] الصورة بحجم كبير وغير مقصوصة
- [ ] السعر دائرة صفراء واضحة
- [ ] الانتقالات fade ناعمة
- [ ] الأشعة في الخلفية تدور (مو ثابتة)
- [ ] الـ intro بخلفية blueTop والـ outro بـ yellowTop
- [ ] الأرقام عربية في كل مكان مرئي
- [ ] الشعار يطلع بـ spring (مو cut)
- [ ] الفيديو يعمل loop ناعم لما يكرّر على الشاشة

---

نهاية الدليل · End of playbook 🎬
