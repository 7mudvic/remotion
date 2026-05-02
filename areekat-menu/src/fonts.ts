import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const CAIRO = "Cairo";

loadFont({
  family: CAIRO,
  url: staticFile("fonts/Cairo-400.ttf"),
  weight: "400",
  format: "truetype",
});
loadFont({
  family: CAIRO,
  url: staticFile("fonts/Cairo-500.ttf"),
  weight: "500",
  format: "truetype",
});
loadFont({
  family: CAIRO,
  url: staticFile("fonts/Cairo-600.ttf"),
  weight: "600",
  format: "truetype",
});
