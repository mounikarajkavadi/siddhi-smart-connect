export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const u = url.trim();
  const yt =
    u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{6,})/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (/^https?:\/\//.test(u)) return u;
  return null;
}
