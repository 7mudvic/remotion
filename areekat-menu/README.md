# Areekat Al Balad — TV Menu Display

شاشة عرض قائمة طعام احترافية لمطعم **عَريكة البَلَدَة**، مبنية باستخدام [Remotion](https://www.remotion.dev/).

## كيف تستخدم

```bash
npm install
npm run dev          # افتح Remotion Studio على المتصفح
npm run build        # رندر فيديو نهائي MP4 في out/menu.mp4
npm run still        # حفظ صورة معاينة PNG
```

## استبدال الصور

ضع صور الأطباق الفعلية في `public/images/` بنفس الأسماء (PNG):

| الصنف | الملف |
|--------|-------|
| عريكة الجبن | `public/images/cheese.png` |
| عريكة اللحم | `public/images/meat.png` |
| عريكة الدجاج | `public/images/chicken.png` |

ثم حدّث `src/data.ts` لتغيير الامتداد من `.svg` إلى `.png`.

## تخصيص

- **الأطباق والأسعار**: `src/data.ts`
- **الألوان**: `src/theme.ts`
- **مدة كل صنف**: `DISH_FRAMES` في `src/AreekatMenu.tsx` (افتراضياً 180 frame = 6 ثواني)
