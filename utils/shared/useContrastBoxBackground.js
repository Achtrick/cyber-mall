import { useEffect, useState } from "react";

// The admin dashboard shows shop logos on a light box (--surface-alt). A shop's
// uploaded logo can be white/near-white (or mostly transparent), which then
// disappears into that light box. This samples the image's actual pixel data
// client-side to decide whether the box behind it should stay light or switch
// to a dark one for contrast -- same idea as utils/config/convertHelper's
// deduceColor, but driven by image content instead of a configured hex color.

const LIGHT_BG = "var(--surface-alt)";
const DARK_BG = "var(--ink)";
const SAMPLE_SIZE = 24;
// Logos that are mostly transparent (a light PNG with a cutout background) read
// as "light" too, since there's little opaque pixel data to judge -- they'd
// still vanish into the light box.
const LIGHT_LUMINANCE_THRESHOLD = 0.82;
const MIN_OPAQUE_RATIO = 0.08;

/** Decides whether the box behind `src` should be light or dark for contrast.
 * Same-origin images only (this app always serves logos from its own
 * /api/images route, so canvas sampling never hits a cross-origin taint). */
export const useContrastBoxBackground = (src) => {
  const [background, setBackground] = useState(LIGHT_BG);

  useEffect(() => {
    if (!src) {
      setBackground(LIGHT_BG);
      return;
    }

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        let weightedLuminance = 0;
        let alphaSum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const luminance =
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          weightedLuminance += luminance * data[i + 3];
          alphaSum += data[i + 3];
        }

        const opaqueRatio = alphaSum / (255 * SAMPLE_SIZE * SAMPLE_SIZE);
        const avgLuminance = alphaSum > 0 ? weightedLuminance / alphaSum : 1;
        const looksLight =
          opaqueRatio < MIN_OPAQUE_RATIO || avgLuminance > LIGHT_LUMINANCE_THRESHOLD;

        setBackground(looksLight ? DARK_BG : LIGHT_BG);
      } catch {
        setBackground(LIGHT_BG);
      }
    };
    img.onerror = () => !cancelled && setBackground(LIGHT_BG);
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return background;
};
