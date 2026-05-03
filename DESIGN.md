# 🎨 DESIGN PLAYBOOK · عَريكة البلدة (نسخة نهائية)

> دليل التصميم النهائي الكامل لعرض المنيو على شاشة TV.
> هذا الملف يلتقط كل قرار تم اتخاذه — ألوان، خطوط، تخطيط، حركة، توقيت،
> قواعد القص، أكواد، ومواصفات الأصول. أي شخص (مصمم، مطوّر، أو AI في
> محادثة جديدة) يقدر يبني نفس الستايل بالضبط من هذا الملف وحده.

This is the **frozen final** design system for the **Areekat Al-Balad**
in-store menu slideshow. Anyone reading this file should be able to
recreate the exact same look from scratch, or extend it with new dishes
without breaking the visual language.

---

## 0 · ملخص النسخة النهائية / Final State Snapshot

**الفيديو:** 1920×1080 @ 30fps · بدون صوت · مدّته 18.3 ثانية لـ 3 أصناف
(يتدرّج تلقائياً مع عدد الأصناف).

**هيكل الفيديو:** 3 أصناف back-to-back، fade بسيط بينهم. **لا يوجد
intro، لا يوجد outro** — مصمم لـ loop مستمر على شاشة المحل.

**كل صنف يعرض:**
- ترقيم على اليمين (pill أصفر) + badge على اليسار
- عنوان عربي ضخم في الوسط
- صورة الطبق في منتصف الشاشة تماماً (المسافة يمين = يسار)
- سعر بنص خام على اليسار (بدون خلفية، بدون بنر)
- خلفية sunburst متبادلة (الصنف الفردي أزرق فوق، الزوجي أصفر فوق)

**اللون يعكس الخلفية:** لو الخلفية زرقاء، السعر **أصفر**. لو الخلفية صفراء،
السعر **أزرق برند**. التباين دائماً قوي.

---

## 1 · الفلسفة / Design Philosophy

| Principle | بالعربي | الشرح |
|---|---|---|
| **Brand-true, not generic** | هوية أولاً | الألوان من الشعار. لا "luxury cinematic". |
| **RTL first** | عربي أولاً | كل الترتيب يمين-يسار. أرقام عربية في الترقيم. |
| **Zone layout** | مناطق منفصلة | flex column صارم، ولا absolute fills متداخلة. |
| **Hero is the food** | الصورة هي البطل | الطبق في منتصف الشاشة، object-fit:contain، بدون قص. |
| **Silent always** | بدون صوت | لا موسيقى ولا مؤثرات. |
| **No intro/outro** | بدون شاشات افتتاح/ختام | المنيو يبدأ مباشرة وينتهي مباشرة، مثالي للـ loop. |
| **Adaptive contrast** | تباين تلقائي | السعر يقلب لونه ضد لون الخلفية. |
| **Bold motion only** | حركة واضحة فقط | spring + fade. لا particles، لا film grain. |

---

## 2 · توكنات الهوية / Brand Tokens

### الألوان — `src/theme.ts`

```ts
export const THEME = {
  // Royal brand blue (= logo background)
  blue:      '#1e3fa3',  // المرجعي - يستخدم للخلفية الزرقاء وللنص الأزرق
  blueHi:    '#2f55c4',
  blueLo:    '#0c1f5a',
  blueDeep:  '#091236',

  // Warm honey-yellow (= logo oval)
  yellow:    '#f5c233',  // المرجعي - يستخدم للخلفية الصفراء وللنص الأصفر
  yellowHi:  '#ffd76b',  // النص الأصفر يستخدم هذا (أوضح من yellow على بلو)
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

### الخطوط — `src/fonts.ts`

| استخدام | الخط | الوزن | لماذا |
|---|---|---|---|
| العناوين الكبيرة + الأرقام | **Cairo** | 900 (Black) | عربي ضخم، حواف حادة، يقرأ من بعد |
| نص "السعر" | **Tajawal** | 700 | أنظف للنصوص الصغيرة |
| السطر الإنجليزي تحت العنوان | **Reem Kufi** | 400 | letter-spacing عالي، إحساس "menu-card" |

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

### المقاسات الرئيسية

| Element | Size | Notes |
|---|---|---|
| Frame | **1920 × 1080 @ 30 fps** | Also: 4K (3840×2160), Vertical (1080×1920) |
| Dish title (Arabic) | 110 px Cairo Black | letter-spacing: -2 |
| English subtitle | 26 px Reem Kufi 400 | letter-spacing: 6, uppercase |
| Index pill | 26 px Cairo 900 | radius 999, padding 8/22 |
| Badge label | 28 px Cairo 700 | dashed border 3px |
| Price label "السعر" | size × 0.13 (≈ 30 px) | Tajawal 700, letter-spacing 6 |
| Price number | size × 0.95 (≈ 219 px) | Cairo 900, letter-spacing −4, soft shadow |
| Price unit "ر.س" | size × 0.26 (≈ 60 px) | Cairo 900, RTL |
| `size` constant | **230** | تمرر إلى `<PriceBadge size={230} />` |
| Dish image box | 1500 × (HERO_H − 60) | object-fit contain, becomes ~720×720 |

---

## 3 · شبكة التخطيط النهائية / Final Layout Grid

```
┌──────────────────────────────────────────────────┐
│  TOP STRIP (10 %)                                │
│  [index-pill RIGHT]            [badge LEFT]      │
├──────────────────────────────────────────────────┤
│  TITLE (18 %)                                    │
│           Arabic title (centered)                │
│             English subtitle                     │
├──────────────────────────────────────────────────┤
│  HERO (72 %)                                     │
│                                                  │
│   [PRICE          [DISH IMAGE                    │
│    text]           absolute centre                │
│    left:100        of the entire screen]         │
│                                                  │
│                       paddingBottom: 60          │
└──────────────────────────────────────────────────┘
```

**القواعد الأهم:**
- AbsoluteFill خارجي بـ `display: flex; flexDirection: column; direction: rtl`
- TOP_H = `0.10 × height` ، TITLE_H = `0.18 × height` ، HERO_H = الباقي
- HERO يستخدم `position: relative` ، مش flex
- داخل HERO: الطبق `position: absolute; inset: 0 0 60px 0` (يخصم 60 من الأسفل)
- مع `display:flex; alignItems:center; justifyContent:center` فيتمركز بدقة في وسط الشاشة
- السعر `position: absolute; left: 100; top: 0; bottom: 60; alignItems:center` فيبقى ثابت يساراً
- لون السعر = عكس لون الخلفية (انظر القسم 5)

---

## 4 · الحركة / Animation

كل التحريك بـ **spring** من Remotion. لا CSS transitions.

| العنصر | التحريك | تأخير | spring config |
|---|---|---|---|
| Index pill (top) | fade-in | 3-18 f | — |
| Badge label | fade مع البقية | 3-18 f | — |
| Title | slide down + fade | 6-22 f | `damping:14, stiffness:110, mass:0.7` |
| English subtitle | fade only | 18-36 f | — |
| Hero product | spring scale 0.86→1.0 + breath | 4 f | `damping:14, stiffness:90, mass:1` |
| Price (whole stack) | spring scale + float ±2 px | 28 f | `damping:12, stiffness:110, mass:0.7` |
| Price label fade | linear | local 4-18 | — |
| Price number fade | linear | local 10-26 | — |
| Price unit fade | linear | local 16-30 | — |
| Scene fade out | last 18 frames | — | linear interpolate |

**Spring template:**
```ts
const sp = spring({
  frame: frame - DELAY,
  fps,
  config: {damping: 14, stiffness: 110, mass: 0.7},
});
```

**Drift / breath** للـ hero image و price:
```ts
const breath = 1 + Math.sin(frame / 28) * 0.014;  // gentle ±1.4% scale
const float  = Math.sin(frame / 32) * 2;          // ±2 px Y float
```

---

## 5 · لون السعر التكيّفي / Adaptive Price Tone

**القاعدة:** السعر **يعكس** لون الخلفية ليكون التباين أقوى ما يمكن.

| variant الخلفية | tone للسعر | الألوان |
|---|---|---|
| `blueTop` (شاشة زرقاء) | `'yellow'` | label = `THEME.yellow`, number = `THEME.yellowHi`, unit = `THEME.yellow` |
| `yellowTop` (شاشة صفراء) | `'blue'` | label = `THEME.blue`, number = `THEME.blue`, unit = `THEME.blue` |

**ملاحظة مهمة:** لا تستخدم `THEME.blueDeep` (#091236) للنص الأزرق على
خلفية صفراء — قراءته على TV تطلع شبه أسود ميت. استخدم `THEME.blue`
(#1e3fa3) بالضبط نفس لون الخلفية الزرقاء، عشان اللون موحّد عبر الفيديو.

في `DishShowcase.tsx`:
```ts
const variant: 'blueTop' | 'yellowTop' = index % 2 === 1 ? 'blueTop' : 'yellowTop';
const onYellow = variant === 'yellowTop';
const bannerTone: 'blue' | 'yellow' = onYellow ? 'blue' : 'yellow';
```

---

## 6 · المكونات / Component Specs

### A · `<SunburstBackground variant>`

خلفية ثنائية اللون (top/bottom) + 36 شعاع conic-gradient يدورون 4°/ثانية.

- variant: `'blueTop'` أو `'yellowTop'`
- mix-blend-mode على طبقة الأشعة فقط
- الصنف الفردي (1, 3, 5...) → `blueTop` ، الزوجي (2, 4, 6...) → `yellowTop`

### B · `<DecorPattern color opacity delay>`

شبكات نقاط 5×5 في الزوايا الأربعة + موجتين على اليمين واليسار.

- color: `THEME.ink` للخلفية الزرقاء، `THEME.blue` للصفراء
- opacity: 0.40
- pointer-events: none

### C · `<ProductCard src delay width height>`

صورة الطبق، spring تظهر، تطفو ببطء، ظل أزرق ناعم تحتها.

- `object-fit: contain` (لا قص أبداً)
- `borderRadius: 24`
- `filter: drop-shadow(0 36px 50px shadowBlue) drop-shadow(0 8px 14px rgba(9,18,54,0.35))`
- spring scale 0.86 → 1.0
- breath ±1.4 % مستمر
- drift ±8 px Y

### D · `<PriceBadge price delay size tone>` ⭐ نسخة نهائية

نص خام بدون أي خلفية. ثلاث طبقات:

```
   السعر         <- size × 0.13, Tajawal 700
    20           <- size × 0.95, Cairo 900, soft shadow
   ر.س           <- size × 0.26, Cairo 900, RTL
```

- props: `price`, `delay`, `size = 230`, `tone = 'blue'`
- الـ `tone` يبدّل لون النص بكامله (انظر القسم 5)
- spring scale + float ±2 px
- لا svg، لا بوردر، لا فيليجري — نص فقط

### E · `<DishShowcase dish index>`

المشهد الكامل لصنف واحد. يجمع كل الأعلى:

```tsx
<AbsoluteFill style={{direction:'rtl', display:'flex', flexDirection:'column'}}>
  <SunburstBackground variant={variant} />
  <DecorPattern color={onYellow ? THEME.blue : THEME.ink} opacity={0.40} />

  <div style={{height: TOP_H, ...}}>
    {/* index pill on right + badge on left */}
  </div>

  <div style={{height: TITLE_H, ...}}>
    {/* Arabic title + English subtitle */}
  </div>

  <div style={{height: HERO_H, position:'relative'}}>
    <div style={{position:'absolute', inset:'0 0 60px 0',
                 display:'flex', alignItems:'center', justifyContent:'center'}}>
      <ProductCard width={1500} height={HERO_H - 60} ... />
    </div>
    <div style={{position:'absolute', left:100, top:0, bottom:60,
                 display:'flex', alignItems:'center'}}>
      <PriceBadge size={230} tone={bannerTone} ... />
    </div>
  </div>
</AbsoluteFill>
```

---

## 7 · التوقيت / Timing

```ts
export const FPS = 30;
export const DISH_FRAMES       = 195; // 6.5 s each
export const TRANSITION_FRAMES = 18;  // 0.6 s overlap (fade)

// (no INTRO_FRAMES, no OUTRO_FRAMES — removed in final cut)
```

**صيغة المدة الكلية:**
```
TOTAL = DISH_FRAMES × N − TRANSITION_FRAMES × (N − 1)
```

| عدد الأصناف | المدة بالـ frames | المدة بالثواني |
|---|---|---|
| 3 | 549 | 18.3 s |
| 5 | 903 | 30.1 s |
| 10 | 1788 | 59.6 s |
| 15 | 2673 | 89.1 s |
| **21** | **3717** | **123.9 s ≈ 2:04** |

**نصيحة:** لو كنت تعرض 10+ أصناف، فكّر تنزّل مدة الصنف من 195 → 150
(5 ثواني) عشان الفيديو ما يطول كثير. يعتمد على إيقاع المحل.

---

## 8 · الأرقام العربية / Arabic Numerals

أي رقم يظهر للمشاهد (ترقيم الصنف) يحوّل لأرقام عربية:

```ts
const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const toArabicNumeral = (n: number) =>
  String(n).split('').map(d => arabicDigits[Number(d)] ?? d).join('');
```

**ملاحظة:** السعر يُكتب جاهز في `data.ts` كنص ("20 ر.س")، فلا يحتاج
تحويل. لو حابب أرقام عربية للسعر، اكتبها مباشرة: `"٢٠ ر.س"`.

---

## 9 · هيكل المشروع / Project Structure

```
src/
├── index.ts                      # Remotion entry
├── Root.tsx                      # 3 compositions: 1080p, 4K, vertical
├── MenuShow.tsx                  # TransitionSeries (no intro/outro)
├── data.ts                       # BRAND + DISHES (edit me!)
├── theme.ts                      # color tokens
├── fonts.ts                      # font loaders
├── components/
│   ├── SunburstBackground.tsx    # animated rays
│   ├── DecorPattern.tsx          # corner dots + waves
│   ├── ProductCard.tsx           # hero photo
│   └── PriceBadge.tsx            # plain-text price (FINAL)
└── scenes/
    ├── DishShowcase.tsx          # the only scene used in final cut
    ├── LogoIntro.tsx             # ⚠️ on disk, not wired into MenuShow
    └── Outro.tsx                 # ⚠️ on disk, not wired into MenuShow

public/
├── logo.png                      # transparent yellow oval (kept for ref)
└── dishes/
    ├── dish-1.png  ← مطبّق جبن مالح
    ├── dish-2.png  ← مطبّق تونة
    ├── dish-3.png  ← مطبّق تونة وجبن
    └── ... (any number of dishes, see Section 12)
```

---

## 10 · القواعد الذهبية / Golden Rules

1. **لا تستخدم Ken Burns** — الزووم يضيع تفاصيل الصورة على شاشة TV.
2. **لا تستخدم film grain أو light leaks أو particles** — الهوية playful مو cinematic.
3. **لا gradient على نص العنوان أو السعر** — اللون السادة أوضح.
4. **لا letter-spacing موجب على العربي** للنصوص العادية — يكسر الحروف. (سالب فقط للأرقام والـ uppercase).
5. **لا خلفية فحمية أو ذهبية** — هوية المطعم أزرق + أصفر فقط.
6. **لا تخلط RTL و LTR في نفس الصف** — استخدم `direction:'rtl'` على
   الـ container و `direction:'ltr'` على الإنجليزي ضمنه.
7. **لا تضع موسيقى أو SFX** — أبداً.
8. **لا تستخدم THEME.blueDeep للنص** — قراءته شبه أسود.
9. **حافظ على المناطق منفصلة** — flex column بـ heights ثابتة، لا
   absolute متداخلة (إلا في HERO حيث الطبق + السعر يكونون absolute داخل
   حاوية relative).
10. **لا تضف intro/outro** بدون موافقة — الفيديو مصمم للـ loop.

---

## 11 · براومبت جاهز للنسخ / Ready-to-Paste Prompt

> انسخ هذا المربع كاملاً وألصقه في بداية أي محادثة جديدة مع Claude (أو أي AI كود) لما تبي تبني فيديو منيو جديد بنفس الستايل النهائي:

````markdown
أبني فيديو Remotion لعرض منيو مطعم على شاشة TV بالستايل التالي بالضبط:

**الهوية (عَريكة البلدة):**
- أزرق ملكي #1e3fa3 + أصفر ذهبي #f5c233 فقط.
- palette: blue:#1e3fa3 blueHi:#2f55c4 blueLo:#0c1f5a blueDeep:#091236
  yellow:#f5c233 yellowHi:#ffd76b yellowLo:#a87b14 cream:#fff8e3 ink:#0a1638
- الخطوط: Cairo (display 900, الأرقام والعناوين), Tajawal (label 700),
  ReemKufi (English accents 400). حمّلها من @remotion/google-fonts بـ
  subsets ['arabic','latin'] + ignoreTooManyRequestsWarning:true.

**الفلسفة:**
- RTL أولاً: كل التخطيط يمين-يسار، أرقام عربية ٠١٢٣٤٥٦٧٨٩ في الترقيم.
- بدون أي صوت أو موسيقى. silent تماماً.
- بدون شاشة intro، بدون شاشة outro. الفيديو يبدأ مباشرة على الصنف الأول
  وينتهي على الصنف الأخير، مصمم لـ loop مستمر.
- Hero: الصورة في منتصف الشاشة بالضبط، object-fit:contain، بدون Ken Burns.
- لا film grain، لا particles، لا light leaks، لا gold frames. playful مو cinematic.

**التخطيط (لكل مشهد صنف 1920×1080 @ 30fps):**
- AbsoluteFill خارجي بـ display:flex flexDirection:column direction:rtl
- 3 أعمدة بنسب ثابتة:
  10% TOP STRIP: pill ترقيم على اليمين، badge dashed على اليسار
  18% TITLE: عنوان عربي Cairo 900 110px وسط، subtitle ReemKufi 26px تحت
  72% HERO (position:relative):
    - الطبق absolute بـ inset:'0 0 60px 0' + flex center → في منتصف الشاشة
    - السعر absolute left:100 top:0 bottom:60 + alignItems:center
- SunburstBackground و DecorPattern absolute (خلفية فقط)

**المكونات:**
1. SunburstBackground: variant 'blueTop' للصنف الفردي، 'yellowTop' للزوجي.
   36 شعاع conic-gradient + mix-blend-mode:overlay على الأشعة.
2. DecorPattern: 4 شبكات نقاط 5×5 في الزوايا + موجتين يمين/يسار.
   color = onYellow ? THEME.blue : THEME.ink، opacity 0.40
3. ProductCard: object-fit:contain، borderRadius:24، spring scale 0.86→1.0،
   drop-shadow أزرق مزدوج، breath ±1.4%.
4. PriceBadge: نص خام بدون خلفية. 3 سطور:
   - "السعر" (Tajawal 700, size×0.13, letter-spacing 6, uppercase)
   - الرقم (Cairo 900, size×0.95, letter-spacing -4, soft shadow)
   - "ر.س" (Cairo 900, size×0.26, RTL)
   default size=230. tone='blue' أو 'yellow' يقلب لون النص بالكامل.

**اللون التكيّفي للسعر (مهم جداً):**
- خلفية زرقاء (blueTop) → tone='yellow':
    label=yellow, number=yellowHi, unit=yellow
- خلفية صفراء (yellowTop) → tone='blue':
    label=blue, number=blue (مش blueDeep!), unit=blue
- الأزرق المستخدم للنص = THEME.blue نفس لون الخلفية الزرقاء بالضبط.

**التوقيت:** DISH=195f (6.5s) لكل صنف، TRANSITION=18f fade.
TOTAL = DISH×N − TRANSITION×(N−1)

**القاعدة الذهبية:** الصنف الأول blueTop، الثاني yellowTop، الثالث blueTop،
الرابع yellowTop... يتبادلون.

**الأصول:**
- public/dishes/dish-N.png — PNG بخلفية شفافة، الصحن الخشبي + الكرتون فقط
  (لا خلفية بنفسجية/صفراء أصلية).
- public/logo.png (شفاف).
- src/data.ts فيه DISHES[] (image, nameAr, nameEn, descriptionAr, price, badge).

ابدأ ببناء المشروع كاملاً بنفس الستايل النهائي.
````

---

## 12 · إضافة أصناف جديدة / Adding New Dishes

### الأسماء والمسارات

أسماء الملفات في `public/dishes/` يفضّل تكون بالإنجليزي/الأرقام (`dish-1.png`,
`dish-2.png`...) لتفادي مشاكل الـ URL encoding. الاسم العربي للعرض يكون في
`data.ts` فقط.

لو سلّمت ملفات بأسماء عربية، أعد تسميتها لـ slugs نظيفة:
- `مطبق جبن مالح.png` → `dish-cheese.png` أو `dish-1.png`
- `مطبق تونة.png` → `dish-tuna.png` أو `dish-2.png`

### مواصفات صور الأصناف (PNG)

| المواصفة | القيمة |
|---|---|
| الصيغة | **PNG** (الـ JPEG لا يدعم الشفافية) |
| الخلفية | شفافة 100٪ |
| المحتوى | الصحن الخشبي + الكرتون اللي تحته فقط |
| الحجم الأمثل | 1500 × 1500 بكسل (مربع تقريباً) |
| الحواف | حادة ونظيفة، بدون خط أبيض/بنفسجي/أصفر |
| التركيز | الطبق في وسط الكنفا |

### تعديل `data.ts`

كل صنف entry فيه 6 حقول:
```ts
{
  image: 'dishes/dish-N.png',    // مسار الصورة في /public
  nameAr: 'مطبّق X',             // الاسم بالعربي (يظهر كعنوان كبير)
  nameEn: 'X Mutabbaq',          // الاسم بالإنجليزي (subtitle صغير)
  descriptionAr: '...',          // ⚠️ غير مستخدم حالياً، مفيد للمستقبل
  price: '20 ر.س',               // السعر كنص جاهز
  badge: 'الأكثر طلباً',          // ⚠️ اختياري - يظهر يسار الترقيم
}
```

### حساب المدة

كل صنف يأخذ 6.5 ثانية. لـ N أصناف:
- N = 3 → 18.3 ثانية
- N = 10 → ~60 ثانية
- N = 21 → ~124 ثانية (دقيقتين)

لو عندك 15+ صنف وتبي تخفّض المدة، عدّل في `data.ts`:
```ts
export const DISH_FRAMES = 150;  // 5s بدل 6.5s
```

### التبديل بين الخلفيات

كود الخلفية تلقائي بناءً على الـ index:
```ts
const variant = index % 2 === 1 ? 'blueTop' : 'yellowTop';
```
- صنف 1, 3, 5, 7... → خلفية زرقاء فوق
- صنف 2, 4, 6, 8... → خلفية صفراء فوق

ما تحتاج تتدخل فيها يدوياً.

### اختبار قبل الاعتماد

```bash
npm run dev          # افتح Remotion Studio
# اختر MenuShow وشاهد المعاينة الحيّة
npm run build        # تصدّر MP4 1080p
```

---

## 13 · checklist للقبول / Acceptance Checklist

قبل ما تعتمد فيديو نهائي:

- [ ] الفيديو 1920×1080 @ 30fps
- [ ] لا صوت ولا موسيقى
- [ ] لا شاشة intro، لا شاشة outro
- [ ] كل النصوص العربية تظهر RTL وغير مكسورة
- [ ] العنوان والصورة لا يتداخلان
- [ ] الصورة في منتصف الشاشة بالضبط (المسافة يمين = يسار)
- [ ] السعر على اليسار، نص خام بدون خلفية
- [ ] لون السعر يقلب: أصفر على أزرق، أزرق على أصفر
- [ ] الأزرق المستخدم للنص = #1e3fa3 (مش blueDeep)
- [ ] الأشعة في الخلفية تدور
- [ ] الصنف الأول blueTop، الثاني yellowTop... متبادلين
- [ ] الأرقام عربية في ترقيم الصنف ("صنف ١")
- [ ] الفيديو يعمل loop ناعم لما يكرّر على الشاشة

---

## 14 · سجل التغييرات / Changelog

| النسخة | التاريخ | التغيير |
|---|---|---|
| v1 | البداية | Cinematic gold/charcoal، Ken Burns، 3 dishes + intro + outro |
| v2 | rebrand | تبديل إلى أزرق + أصفر، palette الجديدة |
| v3 | RTL rebuild | RTL كامل، sunburst، ProductCard، 3-zone layout |
| v4 | clean cuts | rembg → user manual cuts، dish أكبر |
| v5 | luxury banner | Vertical pennant بنر، blue + gold |
| v6 | adaptive tone | بنر يقلب لونه ضد الخلفية |
| **v7 (final)** | **plain text** | **بدون بنر، نص خام، بدون intro/outro، dish في المنتصف** |

---

نهاية الدليل · End of playbook 🎬
