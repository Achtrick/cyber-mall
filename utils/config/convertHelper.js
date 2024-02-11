import Resizer from "react-image-file-resizer";
import imageCompression from "browser-image-compression";

export function isColorDark(color) {
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 160;
}

export function deduceColor(color) {
  return isColorDark(color) ? "white" : "black";
}

export function calculateDiscount(price, discount) {
  return price - (price * discount) / 100;
}

export const getThumbnail = async (file) =>
  await new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      600,
      600,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 0.25,
    maxWidthOrHeight: 720,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
};
