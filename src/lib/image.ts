// Admin koi bhi photo de, yeh khud chhoti WebP bana deta hai (square, ~10-25KB).
function loadImg(file: File): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("not-image")); };
    img.src = url;
  });
}

export async function toWebpDataUrl(file: File, size = 320, quality = 0.75): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("not-image");
  const img = await loadImg(file);
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  const out = Math.min(size, side);
  const c = document.createElement("canvas");
  c.width = out;
  c.height = out;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, out, out);
  ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
  let url = c.toDataURL("image/webp", quality);
  if (!url.startsWith("data:image/webp")) url = c.toDataURL("image/jpeg", quality); // purane Safari
  return url;
}

export const dataUrlKB = (u: string) => Math.round((u.length * 0.75) / 1024);
