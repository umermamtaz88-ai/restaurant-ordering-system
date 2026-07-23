/**
 * Custom Next.js image loader — hits Unsplash CDN directly.
 * Avoids the slow local image optimizer (download + re-encode) that makes
 * first page loads feel stuck on Windows / cold starts.
 */
export default function unsplashLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const q = quality ?? 70;

  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    return url.toString();
  }

  // Local / other remotes — pass through with width hint if possible
  if (src.startsWith("/")) {
    return src;
  }
  return src;
}
