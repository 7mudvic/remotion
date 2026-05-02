# عَريكة البلدة · Menu Slideshow

نموذج أولي سينمائي فخم مبني على [Remotion](https://www.remotion.dev) لعرض
أصناف عَريكة البلدة على شاشة تلفيزيون داخل المحل. هوية أزرق ملكي + أصفر
ذهبي، جاهز للتشغيل بمعاينة فورية.

A cinematic, premium menu slideshow for **Areekat Al-Balad**, built with
Remotion for in-store TV display. Royal-blue + golden-yellow brand identity.
Runs out-of-the-box with built-in placeholder art so you can preview the
motion immediately.

---

## ✦ المميزات / Highlights

- **Logo intro** — كشف الشعار بإضاءة ذهبية، جسيمات، وتسرّبات ضوء سينمائية.
- **3× Dish showcases** — كل صنف بحركة Ken Burns، بانل نص ذهبي ينزلق،
  سعر يقفز بسلم spring، وفاصل ذهبي زخرفي.
- **Outro** — لقطة ختامية للشعار + دعوة للزيارة بالعربية.
- **Cinematic transitions** بين المشاهد (slide / wipe / fade) من
  `@remotion/transitions`.
- **Film grain + vignette + light leaks** على كل لقطة عشان الإحساس السينمائي.
- **3 صيغ تصدير** جاهزة: 1080p, 4K (3840×2160), و عمودي (1080×1920).
- خطوط فخمة: **Cormorant Garamond**, **Playfair Display**, **El Messiri**
  (يدعم العربية).

---

## 🚀 البدء السريع / Quick start

```bash
npm install
npm run dev          # opens Remotion Studio at http://localhost:3000
```

داخل الاستوديو اختر تركيبة `MenuShow` وشاهد المعاينة الحيّة.

To render the final video:

```bash
npm run build        # 1080p H.264 (out/menu-show.mp4)
npm run build:hq     # 1080p with very low CRF (master quality)
npm run build:prores # ProRes 4444 .mov for editing pipelines
```

For the 4K master:

```bash
npx remotion render MenuShow4K out/menu-show-4k.mp4
```

For vertical (digital signage / social):

```bash
npx remotion render MenuShowVertical out/menu-show-vertical.mp4
```

---

## 🖼️ الأصول الحالية / Current assets

الصور الحقيقية مربوطة بالفعل:

| الملف | المحتوى |
|---|---|
| `public/logo.png`            | الشعار (تمت إزالة الخلفية الزرقاء، أصبح شفّافاً) |
| `public/dishes/dish-1.jpg`   | مطبّق جبن مالح |
| `public/dishes/dish-2.jpg`   | مطبّق تونة |
| `public/dishes/dish-3.jpg`   | مطبّق تونة وجبن |

النصوص والأسعار والأوصاف موجودة في `src/data.ts`، عدّلها متى ما تبي. لو
ضفت أصناف أكثر من 3، طول الفيديو يتعدّل تلقائياً.

### استبدال صورة لاحقاً

استبدل أي ملف JPG في `public/dishes/` بنفس الاسم تماماً، أو ضِف صورة جديدة
وغيّر مسارها في `src/data.ts`.

---

## 🎨 تخصيص الألوان / Theming

كل ألوان الفيديو مجمّعة في `src/theme.ts`. عدّل `gold`, `bgTop`,
`cream`... وكل المشاهد تتحدث في نفس اللحظة. مثال لألوان كلاسيكية حمراء:

```ts
export const THEME = {
  bgTop: '#1a0808',
  bgMid: '#2a0a0a',
  bgBottom: '#080202',
  goldHi: '#ffd47a',
  gold: '#c87a3a',
  goldLo: '#6a2a14',
  // ...
};
```

---

## 📁 هيكل المشروع / Project structure

```
src/
├── index.ts                 # entry point
├── Root.tsx                 # 3 compositions (1080p, 4K, vertical)
├── MenuShow.tsx             # top-level video (TransitionSeries)
├── data.ts                  # brand + dish content (edit me!)
├── theme.ts                 # colours, typography
├── fonts.ts                 # Google Fonts loader (subset-trimmed)
├── components/
│   ├── CinematicBackground.tsx   # animated radial gradient
│   ├── Vignette.tsx              # corner darkening
│   ├── FilmGrain.tsx             # @remotion/noise grain overlay
│   ├── Particles.tsx             # floating golden bokeh
│   ├── LightLeak.tsx             # anamorphic flare sweep
│   ├── GoldFrame.tsx             # animated corner brackets
│   ├── AnimatedDivider.tsx       # gold diamond divider
│   └── KenBurnsImage.tsx         # cinematic photo zoom/pan
└── scenes/
    ├── LogoIntro.tsx
    ├── DishShowcase.tsx
    └── Outro.tsx

public/
├── logo.svg                 # placeholder — replace with real logo
└── dishes/
    ├── dish-1.svg           # placeholder dish art
    ├── dish-2.svg
    └── dish-3.svg
```

---

## 🛠️ المكتبات / Libraries

- [`remotion`](https://www.remotion.dev) — programmatic video framework
- [`@remotion/transitions`](https://www.remotion.dev/docs/transitions) —
  frame-perfect slide / fade / wipe transitions
- [`@remotion/google-fonts`](https://www.remotion.dev/docs/google-fonts) —
  Cormorant Garamond, Playfair Display, El Messiri
- [`@remotion/noise`](https://www.remotion.dev/docs/noise) — deterministic
  film grain
- [`@remotion/paths`](https://www.remotion.dev/docs/paths) /
  [`@remotion/shapes`](https://www.remotion.dev/docs/shapes) — vector
  primitives for the gold ornaments
- [`@remotion/zod-types`](https://www.remotion.dev/docs/zod-types) — schema
  helpers for Remotion props

---

## 📺 توصيات التشغيل في المحل / In-store playback tips

- صدّر بصيغة `MP4 H.264 yuv420p` للتوافق مع كل تلفزيونات السمارت.
- لو الشاشة 4K، صدّر `MenuShow4K` للحدّة القصوى.
- شغّل الفيديو في **Loop** على الشاشة — الـ outro والـ intro مصمّمين
  ليلتقوا بشكل ناعم في الـ loop.
