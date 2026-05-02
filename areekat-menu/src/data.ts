export type DishSize = {
  label: string;
  price: number;
};

export type Dish = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  sizes: DishSize[];
};

export const CURRENCY = "ر.س";

export const DISHES: Dish[] = [
  {
    id: "cheese",
    name: "عريكة الجبن",
    tagline: "ذوبان جبن أصيل على عجينة طازجة",
    image: "images/cheese.svg",
    sizes: [
      { label: "صغير", price: 20 },
      { label: "وسط", price: 30 },
      { label: "كبير", price: 40 },
    ],
  },
  {
    id: "meat",
    name: "عريكة اللحم",
    tagline: "لحم مفروم متبّل مع خضار طازجة",
    image: "images/meat.svg",
    sizes: [
      { label: "صغير", price: 30 },
      { label: "وسط", price: 45 },
      { label: "كبير", price: 60 },
    ],
  },
  {
    id: "chicken",
    name: "عريكة الدجاج",
    tagline: "قطع دجاج مشوية مع نكهات مميزة",
    image: "images/chicken.svg",
    sizes: [
      { label: "صغير", price: 25 },
      { label: "وسط", price: 35 },
      { label: "كبير", price: 45 },
    ],
  },
];
