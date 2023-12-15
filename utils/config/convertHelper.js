import Compress from "compress.js";

const compress = new Compress();

export async function compressImage(file) {
  const res = await compress.compress([file], {
    size: 0.5, // the max size in MB, defaults to 2MB
    quality: 0.8, // the quality of the image, max is 1,
    maxWidth: 600, // the max width of the output image, defaults to 1920px
    maxHeight: 600, // the max height of the output image, defaults to 1920px
    resize: true, // defaults to true, set false if you do not want to resize the image width and height
  });
  return `data:image/webp;base64,${res[0].data}`;
}

export function isColorDark(color) {
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}
