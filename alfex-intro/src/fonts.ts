import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const INTER_FAMILY = "Inter";
export const CAIRO_FAMILY = "Cairo";

loadFont({
  family: INTER_FAMILY,
  url: staticFile("Inter-500.ttf"),
  weight: "500",
  format: "truetype",
});
loadFont({
  family: INTER_FAMILY,
  url: staticFile("Inter-600.ttf"),
  weight: "600",
  format: "truetype",
});
loadFont({
  family: INTER_FAMILY,
  url: staticFile("Inter-700.ttf"),
  weight: "700",
  format: "truetype",
});
loadFont({
  family: INTER_FAMILY,
  url: staticFile("Inter-800.ttf"),
  weight: "800",
  format: "truetype",
});

loadFont({
  family: CAIRO_FAMILY,
  url: staticFile("Cairo-400.ttf"),
  weight: "400",
  format: "truetype",
});
loadFont({
  family: CAIRO_FAMILY,
  url: staticFile("Cairo-500.ttf"),
  weight: "500",
  format: "truetype",
});
loadFont({
  family: CAIRO_FAMILY,
  url: staticFile("Cairo-600.ttf"),
  weight: "600",
  format: "truetype",
});
